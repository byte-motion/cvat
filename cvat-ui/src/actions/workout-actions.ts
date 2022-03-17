// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import { ActionUnion, createAction, ThunkAction } from 'utils/redux';
import { ActionCreator, Dispatch } from 'redux';

import getCore from 'cvat-core-wrapper';
// import { Workout } from 'reducers/interfaces';

const cvat = getCore();

export enum WorkoutActionTypes {
    OPEN_WORKOUT_MODAL = 'OPEN_WORKOUT_MODAL',
    CLOSE_WORKOUT_MODAL = 'CLOSE_WORKOUT_MODAL',
    CREATE_WORKOUT = 'CREATE_WORKOUT',
    CREATE_WORKOUT_SUCCESS = 'CREATE_WORKOUT_SUCCESS',
    CREATE_WORKOUT_FAILED = 'CREATE_WORKOUT_FAILED',
    GET_WORKOUT = 'GET_WORKOUT',
    GET_WORKOUT_SUCCESS = 'GET_WORKOUT_SUCCESS',
    GET_WORKOUT_FAILED = 'GET_WORKOUT_FAILED',
    GET_WORKOUT_VALIDATIONS = 'GET_WORKOUT_VALIDATIONS',
    GET_WORKOUT_VALIDATIONS_SUCCESS = 'GET_WORKOUT_VALIDATIONS_SUCCESS',
    GET_WORKOUT_VALIDATIONS_FAILED = 'GET_WORKOUT_VALIDATIONS_FAILED',
    GET_WORKOUT_METRICS = 'GET_WORKOUT_METRICS',
    GET_WORKOUT_METRICS_SUCCESS = 'GET_WORKOUT_METRICS_SUCCESS',
    GET_WORKOUT_METRICS_FAILED = 'GET_WORKOUT_METRICS_FAILED',
    DELETE_WORKOUT = 'DELETE_WORKOUT',
    DELETE_WORKOUT_SUCCESS = 'DELETE_WORKOUT_SUCCESS',
    DELETE_WORKOUT_FAILED = 'DELETE_WORKOUT_FAILED',
    STOP_WORKOUT_TRAINING = 'STOP_WORKOUT_TRAINING',
    STOP_WORKOUT_TRAINING_SUCCESS = 'STOP_WORKOUT_TRAINING_SUCCESS',
    STOP_WORKOUT_TRAINING_FAILED = 'STOP_WORKOUT_TRAINING_FAILED',
    UPDATE_WORKOUT = 'UPDATE_WORKOUT',
    UPDATE_WORKOUT_SUCCESS = 'UPDATE_WORKOUT_SUCCESS',
    UPDATE_WORKOUT_FAILED = 'UPDATE_WORKOUT_FAILED',
}

export const workoutActions = {
    openWorkoutModal: (instance: any) => createAction(WorkoutActionTypes.OPEN_WORKOUT_MODAL, { instance }),
    closeWorkoutModal: () => createAction(WorkoutActionTypes.CLOSE_WORKOUT_MODAL),
    createWorkout: (instance: any, name: string) => (
        createAction(WorkoutActionTypes.CREATE_WORKOUT, { instance, name })
    ),
    createWorkoutSuccess: (instance: any, name: string, workout: any) => (
        createAction(WorkoutActionTypes.CREATE_WORKOUT_SUCCESS, { instance, name, workout })
    ),
    createWorkoutFailed: (instance: any, name: string, error: any) => (
        createAction(WorkoutActionTypes.CREATE_WORKOUT_FAILED, {
            instance,
            name,
            error,
        })
    ),
    getWorkout: () => createAction(WorkoutActionTypes.GET_WORKOUT),
    getWorkoutSuccess: (workout: any) => (
        createAction(WorkoutActionTypes.GET_WORKOUT_SUCCESS, { workout })
    ),
    getWorkoutFailed: (error: any) => createAction(WorkoutActionTypes.GET_WORKOUT_FAILED, { error }),
    getWorkoutValidations: () => createAction(WorkoutActionTypes.GET_WORKOUT_VALIDATIONS),
    getWorkoutValidationsSuccess: (images: any) => (
        createAction(WorkoutActionTypes.GET_WORKOUT_VALIDATIONS_SUCCESS, { images })
    ),
    getWorkoutValidationsFailed: (error: any) => createAction(
        WorkoutActionTypes.GET_WORKOUT_VALIDATIONS_FAILED, { error },
    ),
    getWorkoutMetrics: () => createAction(WorkoutActionTypes.GET_WORKOUT_METRICS),
    getWorkoutMetricsSuccess: (image: any) => (
        createAction(WorkoutActionTypes.GET_WORKOUT_METRICS_SUCCESS, { image })
    ),
    getWorkoutMetricsFailed: (error: any) => createAction(
        WorkoutActionTypes.GET_WORKOUT_METRICS_FAILED, { error },
    ),
    stopWorkoutTraining: () => createAction(WorkoutActionTypes.STOP_WORKOUT_TRAINING),
    stopWorkoutTrainingSuccess: (workout: any) => (
        createAction(WorkoutActionTypes.STOP_WORKOUT_TRAINING_SUCCESS, { workout })
    ),
    stopWorkoutTrainingFailed: (workout: any, error: any) => createAction(
        WorkoutActionTypes.STOP_WORKOUT_TRAINING_FAILED, { workout, error },
    ),
    deleteWorkout: () => createAction(WorkoutActionTypes.DELETE_WORKOUT),
    deleteWorkoutSuccess: (workout: any) => (
        createAction(WorkoutActionTypes.DELETE_WORKOUT_SUCCESS, { workout })
    ),
    deleteWorkoutFailed: (workout: any, error: any) => createAction(
        WorkoutActionTypes.DELETE_WORKOUT_FAILED, { workout, error },
    ),
    updateWorkout: () => createAction(WorkoutActionTypes.UPDATE_WORKOUT),
    updateWorkoutSuccess: (workout: any) => (
        createAction(WorkoutActionTypes.UPDATE_WORKOUT_SUCCESS, { workout })
    ),
    updateWorkoutFailed: (workout: any, error: any) => createAction(
        WorkoutActionTypes.UPDATE_WORKOUT_FAILED, { workout, error },
    ),
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
    } catch (error) {
        dispatch(workoutActions.createWorkoutFailed(instance, name, error));
    }
};

export function getWorkoutAsync(
    id: number,
): ThunkAction {
    return async (dispatch: ActionCreator<Dispatch>): Promise<void> => {
        dispatch(workoutActions.getWorkout());

        try {
            const result = await cvat.aifred.getWorkout(id);
            dispatch(workoutActions.getWorkoutSuccess(result));
        } catch (error) {
            dispatch(workoutActions.getWorkoutFailed(error));
        }
    };
}

export function getWorkoutValidationsAsync(
    workout: any,
): ThunkAction {
    return async (dispatch: ActionCreator<Dispatch>): Promise<void> => {
        dispatch(workoutActions.getWorkoutValidations());

        try {
            const images = workout.validations.map(async (name: string) => {
                const image = await cvat.aifred.getWorkoutImage(workout.id, 'validations', name);
                return { name, image };
            });

            const result = await Promise.all(images);

            dispatch(workoutActions.getWorkoutValidationsSuccess(result));
        } catch (error) {
            dispatch(workoutActions.getWorkoutValidationsFailed(error));
        }
    };
}

export function getWorkoutMetricsAsync(
    workout: any,
): ThunkAction {
    return async (dispatch: ActionCreator<Dispatch>): Promise<void> => {
        dispatch(workoutActions.getWorkoutMetrics());

        try {
            const image = await cvat.aifred.getWorkoutMetrics(workout.id);
            dispatch(workoutActions.getWorkoutMetricsSuccess(image));
        } catch (error) {
            dispatch(workoutActions.getWorkoutMetricsFailed(error));
        }
    };
}

export function stopWorkoutTrainingAsync(
    workout: any,
): ThunkAction {
    return async (dispatch: ActionCreator<Dispatch>): Promise<void> => {
        dispatch(workoutActions.stopWorkoutTraining());

        try {
            await cvat.aifred.stopTraining(workout.id);
            dispatch(workoutActions.stopWorkoutTrainingSuccess(workout));
        } catch (error) {
            dispatch(workoutActions.stopWorkoutTrainingFailed(workout, error));
        }
    };
}

export function deleteWorkoutAsync(
    workout: any,
): ThunkAction {
    return async (dispatch: ActionCreator<Dispatch>): Promise<void> => {
        dispatch(workoutActions.deleteWorkout());

        try {
            await cvat.aifred.deleteWorkout(workout.id);
            dispatch(workoutActions.deleteWorkoutSuccess(workout));
        } catch (error) {
            dispatch(workoutActions.deleteWorkoutFailed(workout, error));
        }
    };
}

export function updateWorkoutAsync(
    workout: any,
): ThunkAction {
    return async (dispatch: ActionCreator<Dispatch>): Promise<void> => {
        dispatch(workoutActions.updateWorkout());

        const {
            id, name, dtl, iterations,
        } = workout;

        try {
            await cvat.aifred.updateWorkout(id, name, workout.data_url, dtl.id, iterations);
            dispatch(workoutActions.updateWorkoutSuccess(workout));
        } catch (error) {
            dispatch(workoutActions.updateWorkoutFailed(workout, error));
        }
    };
}

export type WorkoutActions = ActionUnion<typeof workoutActions>;
