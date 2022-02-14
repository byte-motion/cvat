// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import { ActionUnion, createAction, ThunkAction } from 'utils/redux';
import { ActionCreator, Dispatch } from 'redux';

import { useHistory } from 'react-router';
import { WorkoutsQuery } from 'reducers/interfaces';

import getCore from 'cvat-core-wrapper';

const cvat = getCore();

export enum WorkoutsActionTypes {
    OPEN_WORKOUT_MODAL = 'OPEN_WORKOUT_MODAL',
    CLOSE_WORKOUT_MODAL = 'CLOSE_WORKOUT_MODAL',
    CREATE_WORKOUT = 'CREATE_WORKOUT',
    CREATE_WORKOUT_SUCCESS = 'CREATE_WORKOUT_SUCCESS',
    CREATE_WORKOUT_FAILED = 'CREATE_WORKOUT_FAILED',
    GET_WORKOUTS = 'GET_WORKOUTS',
    GET_WORKOUTS_SUCCESS = 'GET_WORKOUTS_SUCCESS',
    GET_WORKOUTS_FAILED = 'GET_WORKOUTS_FAILED',
}

export const workoutActions = {
    openWorkoutModal: (instance: any) => createAction(WorkoutsActionTypes.OPEN_WORKOUT_MODAL, { instance }),
    closeWorkoutModal: () => createAction(WorkoutsActionTypes.CLOSE_WORKOUT_MODAL),
    createWorkout: (instance: any, name: string) => (
        createAction(WorkoutsActionTypes.CREATE_WORKOUT, { instance, name })
    ),
    createWorkoutSuccess: (instance: any, name: string, workout: any) => (
        createAction(WorkoutsActionTypes.CREATE_WORKOUT_SUCCESS, { instance, name, workout })
    ),
    createWorkoutFailed: (instance: any, name: string, error: any) => (
        createAction(WorkoutsActionTypes.CREATE_WORKOUT_FAILED, {
            instance,
            name,
            error,
        })
    ),
    getWorkouts: () => createAction(WorkoutsActionTypes.GET_WORKOUTS),
    getWorkoutsSuccess: (array: any[], count: number) => (
        createAction(WorkoutsActionTypes.GET_WORKOUTS_SUCCESS, { array, count })
    ),
    getWorkoutsFailed: (error: any) => createAction(WorkoutsActionTypes.GET_WORKOUTS_FAILED, { error }),
};

export const createWorkoutAsync = (
    instance: any,
    name: string,
    workspace: number,
    dtl: number | undefined,
    iterations: number,
): ThunkAction => async (dispatch) => {
    dispatch(workoutActions.createWorkout(instance, name));

    try {
        const instanceType = instance instanceof cvat.classes.Project ? 'projects' : 'tasks';
        const instancePath = `${instanceType}/${instance.id}`;
        const workout = await cvat.aifred.createWorkout(name, instancePath, workspace, dtl, iterations);

        dispatch(workoutActions.createWorkoutSuccess(instance, name, workout));

        const history = useHistory();
        history.push(`/workouts/${workout.id}`);
    } catch (error) {
        dispatch(workoutActions.createWorkoutFailed(instance, name, error));
    }
};

export function getWorkoutsAsync(
    query: Partial<WorkoutsQuery>,
): ThunkAction {
    return async (dispatch: ActionCreator<Dispatch>): Promise<void> => {
        dispatch(workoutActions.getWorkouts());
        // Clear query object from null fields
        const filteredQuery: Partial<WorkoutsQuery> = {
            page: 1,
            ...query,
        };

        for (const key in filteredQuery) {
            if (filteredQuery[key] === null) {
                delete filteredQuery[key];
            }
        }

        let result = null;
        try {
            result = await cvat.aifred.getWorkouts(filteredQuery);
        } catch (error) {
            dispatch(workoutActions.getWorkoutsFailed(error));
            return;
        }

        const array = Array.from(result);

        dispatch(workoutActions.getWorkoutsSuccess(array, result.count));
    };
}

export type WorkoutActions = ActionUnion<typeof workoutActions>;
