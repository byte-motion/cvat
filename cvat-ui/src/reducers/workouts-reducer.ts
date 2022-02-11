// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import { WorkoutActions, WorkoutsActionTypes } from 'actions/workouts-actions';
import { WorkoutsState, Workout } from './interfaces';

const defaultState: WorkoutsState = {
    initialized: false,
    instance: null,
    modalVisible: false,
    fetching: false,
    count: 0,
    current: [],
    gettingQuery: {
        page: 1,
        id: null,
        search: null,
        status: null,
    },
    activities: {
        creates: {
            id: null,
            error: '',
        },
    },
};

export default (state: WorkoutsState = defaultState, action: WorkoutActions): WorkoutsState => {
    switch (action.type) {
        case WorkoutsActionTypes.OPEN_WORKOUT_MODAL:
            return {
                ...state,
                modalVisible: true,
                instance: action.payload.instance,
            };
        case WorkoutsActionTypes.CLOSE_WORKOUT_MODAL:
            return {
                ...state,
                modalVisible: false,
                instance: null,
            };
        case WorkoutsActionTypes.CREATE_WORKOUT: {
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
        case WorkoutsActionTypes.CREATE_WORKOUT_FAILED: {
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

        case WorkoutsActionTypes.CREATE_WORKOUT_SUCCESS: {
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

        case WorkoutsActionTypes.GET_WORKOUTS:
            return {
                ...state,
                initialized: false,
                fetching: true,
                count: 0,
                current: [],
            };
        case WorkoutsActionTypes.GET_WORKOUTS_SUCCESS: {
            // const combinedWithPreviews = action.payload.array.map(
            //     (workout: any): Workout => ({
            //         instance: workout
            //     }),
            // );
            const workouts = action.payload.array.map(
                (workout: any): Workout => ({
                    instance: workout,
                    dataset: workout.dataset,
                    preview: workout.preview,
                }),
            );

            return {
                ...state,
                initialized: true,
                fetching: false,
                count: action.payload.count,
                current: workouts,
            };
        }
        case WorkoutsActionTypes.GET_WORKOUTS_FAILED: {
            return {
                ...state,
                initialized: true,
                fetching: false,
            };
        }

        default:
            return state;
    }
};
