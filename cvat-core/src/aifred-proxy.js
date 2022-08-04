// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
(() => {
    const { ServerError } = require('./exceptions');
    const store = require('store');
    const config = require('./config');
    const { isBrowser, isNode } = require('browser-or-node');

    function generateError(errorData) {
        if (errorData.response) {
            const message = `${errorData.message}. ${JSON.stringify(errorData.response.data) || ''}.`;
            return new ServerError(message, errorData.response.status);
        }

        // Server is unavailable (no any response)
        const message = `${errorData.message}.`; // usually is "Error Network"
        return new ServerError(message, 0);
    }

    class AIfredProxy {
        constructor() {
            const Axios = require('axios');

            let token = store.get('aifred_token');
            const signedUrl = store.get('signed_url');

            if (token && signedUrl) {
                Axios.defaults.headers.common.Authorization = token;
                Axios.defaults.headers.common['X-CVAT-User'] = signedUrl;
            }

            async function login(url) {
                const { aifredAPI, proxy } = config;

                Axios.defaults.headers.common.Authorization = '';
                Axios.defaults.headers.common['X-CVAT-User'] = url;

                let authenticationResponse = null;
                try {
                    authenticationResponse = await Axios.get(`${aifredAPI}/auth`, {
                        proxy,
                    });
                } catch (errorData) {
                    throw generateError(errorData);
                }

                token = authenticationResponse.data.token;
                store.set('aifred_token', token);
                store.set('signed_url', url);
                store.set('base_url', url.split('/users/self')[0]);
                Axios.defaults.headers.common.Authorization = token;
            }

            async function workspaces() {
                const { aifredAPI, proxy } = config;

                let response = null;
                try {
                    response = await Axios.get(`${aifredAPI}/workspaces`, {
                        proxy,
                    });
                } catch (errorData) {
                    throw generateError(errorData);
                }

                return response.data;
            }

            async function dtls(workspaceId) {
                const { aifredAPI, proxy } = config;

                let response = null;
                try {
                    response = await Axios.get(`${aifredAPI}/workspaces/${workspaceId}/dtls`, {
                        proxy,
                    });
                } catch (errorData) {
                    throw generateError(errorData);
                }

                return response.data;
            }

            async function createWorkout(name, instance, workspaceId, dtlId, iterations) {
                const { aifredAPI, proxy } = config;

                const baseUrl = store.get('base_url');

                const dataSetPath = `${baseUrl}/${instance}`;

                let response = null;
                try {
                    const data = JSON.stringify({
                        name,
                        iterations,
                        workspace_id: workspaceId,
                        dtl_id: dtlId,
                        data_url: dataSetPath,
                    });
                    response = await Axios.post(`${aifredAPI}/workouts`, data, {
                        proxy,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (errorData) {
                    throw generateError(errorData);
                }

                return response.data;
            }

            async function getSelf() {
                const { aifredAPI, proxy } = config;

                let response = null;
                try {
                    response = await Axios.get(`${aifredAPI}/users/self`, {
                        proxy,
                    });
                } catch (errorData) {
                    throw generateError(errorData);
                }

                return response.data;
            }

            async function authorized() {
                try {
                    await module.exports.getSelf();
                } catch (serverError) {
                    if (serverError.code === 401) {
                        return false;
                    }

                    throw serverError;
                }

                return true;
            }

            async function getWorkouts(filter = '') {
                const { aifredAPI, proxy } = config;

                let response = null;
                try {
                    response = await Axios.get(`${aifredAPI}/workouts?page_size=12&${filter}`, {
                        proxy,
                    });
                } catch (errorData) {
                    throw generateError(errorData);
                }

                response.data.workouts.count = response.data.count;
                return response.data.workouts;
            }

            async function getWorkout(workoutId) {
                const { aifredAPI, proxy } = config;

                let response = null;
                try {
                    response = await Axios.get(`${aifredAPI}/workouts/${workoutId}`, {
                        proxy,
                    });
                } catch (errorData) {
                    throw generateError(errorData);
                }

                return response.data;
            }

            async function getFile(url, period = 2000) {
                return new Promise((resolve, reject) => {
                    const { proxy } = config;

                    async function request() {
                        Axios.get(
                            url,
                            {
                                proxy,
                                responseType: 'blob',
                            },
                        ).then((result) => {
                            if ([202, 201].includes(result.status)) {
                                setTimeout(request, period);
                            } else if (isNode) {
                                // eslint-disable-next-line no-undef
                                resolve(global.Buffer.from(result.data, 'binary').toString('base64'));
                            } else if (isBrowser) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    resolve(reader.result);
                                };
                                reader.readAsDataURL(result.data);
                            }
                        })
                            .catch((error) => {
                                reject(generateError(error));
                            });
                    }

                    setTimeout(request);
                });
            }

            async function getWorkoutImage(workoutId, fileType, fileName) {
                const { aifredAPI } = config;
                const url = `${aifredAPI}/workouts/${workoutId}/file?filetype=${fileType}&filename=${fileName}`;
                return getFile(url);
            }

            async function getWorkoutMetrics(workoutId) {
                const { aifredAPI } = config;
                const queryPeriod = 1000; // in ms

                const url = `${aifredAPI}/workouts/${workoutId}/metrics`;
                return getFile(url, queryPeriod);
            }

            async function getOcellusModel(workoutId, fileName) {
                const { aifredAPI } = config;
                const queryPeriod = 2000; // in ms
                const url = `${aifredAPI}/workouts/${workoutId}/ocellus?filename=${fileName}`;

                return getFile(url, queryPeriod);
            }

            async function stopTraining(workoutId) {
                const { aifredAPI, proxy } = config;
                const queryPeriod = 1000; // in ms

                const url = `${aifredAPI}/workouts/${workoutId}/stop`;

                return new Promise((resolve, reject) => {
                    async function request() {
                        Axios.patch(url, {
                            proxy,
                        })
                            .then((response) => {
                                if ([202, 201].includes(response.status)) {
                                    setTimeout(request, queryPeriod);
                                } else {
                                    resolve(response.data);
                                }
                            })
                            .catch((errorData) => {
                                reject(generateError(errorData));
                            });
                    }
                    setTimeout(request);
                });
            }

            async function deleteWorkout(workoutId) {
                const { aifredAPI, proxy } = config;
                const queryPeriod = 1000; // in ms

                const url = `${aifredAPI}/workouts/${workoutId}`;

                return new Promise((resolve, reject) => {
                    async function request(iterated = false) {
                        Axios.delete(url, {
                            proxy,
                        })
                            .then((response) => {
                                if ([202, 201].includes(response.status)) {
                                    setTimeout(request, queryPeriod, true);
                                } else {
                                    resolve(true);
                                }
                            })
                            .catch((errorData) => {
                                if (iterated && errorData.response.status === 404) {
                                    // Looks legit - 404 after started delete operation
                                    resolve(true);
                                }
                                reject(generateError(errorData));
                            });
                    }
                    setTimeout(request);
                });
            }

            async function updateWorkout(workoutId, name, dataURL, dtlId, iterations) {
                const { aifredAPI, proxy } = config;

                const data = {
                    name,
                    iterations,
                    data_url: dataURL,
                    dtl_id: dtlId,
                };

                // Remove null values from query
                Object.keys(data).forEach((key) => {
                    if (data[key] === null) {
                        delete data[key];
                    }
                });

                let response = null;
                try {
                    response = await Axios.patch(`${aifredAPI}/workouts/${workoutId}`, JSON.stringify(data), {
                        proxy,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (errorData) {
                    throw generateError(errorData);
                }

                return response.data;
            }

            Object.defineProperties(
                this,
                Object.freeze({
                    login: {
                        value: login,
                        writable: false,
                    },
                    workspaces: {
                        value: workspaces,
                        writable: false,
                    },
                    dtls: {
                        value: dtls,
                        writable: false,
                    },
                    createWorkout: {
                        value: createWorkout,
                        writable: false,
                    },
                    getSelf: {
                        value: getSelf,
                        writable: false,
                    },
                    authorized: {
                        value: authorized,
                        writable: false,
                    },
                    getWorkouts: {
                        value: getWorkouts,
                        writable: false,
                    },
                    getWorkout: {
                        value: getWorkout,
                        writable: false,
                    },
                    getFile: {
                        value: getFile,
                        writable: false,
                    },
                    getWorkoutImage: {
                        value: getWorkoutImage,
                        writable: false,
                    },
                    getWorkoutMetrics: {
                        value: getWorkoutMetrics,
                        writable: false,
                    },
                    getOcellusModel: {
                        value: getOcellusModel,
                        writable: false,
                    },
                    stopTraining: {
                        value: stopTraining,
                        writable: false,
                    },
                    deleteWorkout: {
                        value: deleteWorkout,
                        writable: false,
                    },
                    updateWorkout: {
                        value: updateWorkout,
                        writable: false,
                    },
                }),
            );
        }
    }

    const aifredProxy = new AIfredProxy();
    module.exports = aifredProxy;
})();
