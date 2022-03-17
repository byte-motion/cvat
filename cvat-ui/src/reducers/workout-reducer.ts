// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import { WorkoutActions, WorkoutActionTypes } from 'actions/workout-actions';
import { WorkoutState, Workout } from './interfaces';

const defaultState: WorkoutState = {
    instance: null,
    modalVisible: false,
    fetching: false,
    current: null,
    activities: {
        creates: {
            id: null,
            error: '',
        },
        validations: {
            images: [],
            fetching: false,
        },
        metrics: {
            image: null,
            fetching: false,
        },
        deletes: {
            error: '',
        },
        stops: {
            error: '',
        },
    },
};

export default (state: WorkoutState = defaultState, action: WorkoutActions): WorkoutState => {
    switch (action.type) {
        case WorkoutActionTypes.OPEN_WORKOUT_MODAL:
            return {
                ...state,
                modalVisible: true,
                current: null,
                instance: action.payload.instance,
            };
        case WorkoutActionTypes.CLOSE_WORKOUT_MODAL:
            return {
                ...state,
                modalVisible: false,
                current: null,
                instance: null,
            };
        case WorkoutActionTypes.CREATE_WORKOUT: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    creates: {
                        id: null,
                        error: '',
                    },
                },
            };
        }
        case WorkoutActionTypes.CREATE_WORKOUT_FAILED: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    creates: {
                        ...state.activities.creates,
                        error: action.payload.error.toString(),
                    },
                },
            };
        }

        case WorkoutActionTypes.CREATE_WORKOUT_SUCCESS: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    creates: {
                        id: action.payload.workout.id,
                        error: '',
                    },
                },
            };
        }

        case WorkoutActionTypes.GET_WORKOUT:
            return {
                ...state,
                fetching: true,
                current: null,
            };
        case WorkoutActionTypes.GET_WORKOUT_SUCCESS: {
            const workout: Workout = {
                instance: action.payload.workout,
                dataset: action.payload.workout.dataset,
                preview: action.payload.workout.preview,
            };
            return {
                ...state,
                fetching: false,
                current: workout,
            };
        }
        case WorkoutActionTypes.GET_WORKOUT_FAILED: {
            return {
                ...state,
                fetching: false,
            };
        }

        case WorkoutActionTypes.GET_WORKOUT_VALIDATIONS:
            return {
                ...state,
                activities: {
                    ...state.activities,
                    validations: {
                        images: [],
                        fetching: true,
                    },
                },
            };
        case WorkoutActionTypes.GET_WORKOUT_VALIDATIONS_SUCCESS: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    validations: {
                        images: action.payload.images,
                        fetching: false,
                    },
                },
            };
        }
        case WorkoutActionTypes.GET_WORKOUT_VALIDATIONS_FAILED: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    validations: {
                        images: [],
                        fetching: false,
                    },
                },
            };
        }
        case WorkoutActionTypes.GET_WORKOUT_METRICS:
            return {
                ...state,
                activities: {
                    ...state.activities,
                    metrics: {
                        image: null,
                        fetching: true,
                    },
                },
            };
        case WorkoutActionTypes.GET_WORKOUT_METRICS_SUCCESS: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    metrics: {
                        image: action.payload.image,
                        fetching: false,
                    },
                },
            };
        }
        case WorkoutActionTypes.GET_WORKOUT_METRICS_FAILED: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    metrics: {
                        image: null,
                        fetching: false,
                    },
                },
            };
        }
        case WorkoutActionTypes.STOP_WORKOUT_TRAINING:
            return {
                ...state,
                activities: {
                    ...state.activities,
                    stops: {
                        error: '',
                    },
                },
            };
        case WorkoutActionTypes.STOP_WORKOUT_TRAINING_SUCCESS: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    stops: {
                        error: '',
                    },
                },
            };
        }
        case WorkoutActionTypes.STOP_WORKOUT_TRAINING_FAILED: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    stops: {
                        error: action.payload.error,
                    },
                },
            };
        }
        case WorkoutActionTypes.DELETE_WORKOUT:
            return {
                ...state,
                activities: {
                    ...state.activities,
                    deletes: {
                        error: '',
                    },
                },
            };
        case WorkoutActionTypes.DELETE_WORKOUT_SUCCESS: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    deletes: {
                        error: '',
                    },
                },
            };
        }
        case WorkoutActionTypes.DELETE_WORKOUT_FAILED: {
            return {
                ...state,
                activities: {
                    ...state.activities,
                    deletes: {
                        error: action.payload.error,
                    },
                },
            };
        }
        default:
            return state;
    }
};
