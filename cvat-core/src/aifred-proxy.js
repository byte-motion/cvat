// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
(() => {
    const { ServerError } = require('./exceptions');
    const store = require('store');
    const config = require('./config');

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
                }),
            );
        }
    }

    const aifredProxy = new AIfredProxy();
    module.exports = aifredProxy;
})();
