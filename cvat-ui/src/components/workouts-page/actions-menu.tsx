// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Modal from 'antd/lib/modal';
import Menu from 'antd/lib/menu';
import Notification from 'antd/lib/notification';
import { WorkoutStatus } from 'reducers/interfaces';
import { exportActions } from 'actions/export-ocellus-actions';
import { deleteWorkoutAsync, stopWorkoutTrainingAsync } from 'actions/workout-actions';

interface Props {
    workoutInstance: any;
}

export default function WorkoutActionsMenuComponent(props: Props): JSX.Element {
    const { workoutInstance } = props;

    const dispatch = useDispatch();
    const history = useHistory();

    const onDeleteWorkout = useCallback((): void => {
        Modal.confirm({
            title: `The workout '${workoutInstance.name}' #${workoutInstance.id} will be deleted`,
            content: 'All related data will be lost. Continue?',
            className: 'cvat-modal-confirm-remove-workout',
            onOk: () => {
                dispatch(deleteWorkoutAsync(workoutInstance));
                history.push('/workouts');
                Notification.info({
                    message: 'Deleting workout',
                    description:
                        `Workout '${workoutInstance.name}' #${workoutInstance.id} will be deleted.`,
                    className: 'cvat-notification-notice-delete-workout-start',
                });
            },
            okButtonProps: {
                type: 'primary',
                danger: true,
            },
            okText: 'Delete',
        });
    }, []);

    const onStopWorkout = useCallback((): void => {
        Modal.confirm({
            title: `The workout ${workoutInstance.id} training will be stopped`,
            content: 'Do you want to continue?',
            className: 'cvat-modal-confirm-stop-workout',
            onOk: () => {
                dispatch(stopWorkoutTrainingAsync(workoutInstance));
                Notification.info({
                    message: 'Stopping workout',
                    description:
                        `Trying to stop training of workout '${workoutInstance.name}' #${workoutInstance.id}.`,
                    className: 'cvat-notification-notice-stopping-workout-start',
                });
            },
            okButtonProps: {
                type: 'primary',
                danger: true,
            },
            okText: 'Stop',
        });
    }, []);

    const menuItems: JSX.Element[] = [];

    if (workoutInstance.status === WorkoutStatus.TRAINING) {
        menuItems.push(
            <Menu.Item key='stop-workout-training' onClick={onStopWorkout}>
                Stop workout
            </Menu.Item>,
        );
    }

    if (workoutInstance.status === WorkoutStatus.FINISHED) {
        menuItems.push(
            <Menu.Item key='export-ocellus-model' onClick={() => { dispatch(exportActions.openExportModal(workoutInstance)); }}>
                Export to Ocellus
            </Menu.Item>,
        );
    }

    return (
        <Menu selectable={false} className='cvat-workout-actions-menu'>
            {menuItems}
            <Menu.Divider />
            <Menu.Item key='delete-workout' onClick={onDeleteWorkout}>
                Delete workout
            </Menu.Item>
        </Menu>
    );
}
