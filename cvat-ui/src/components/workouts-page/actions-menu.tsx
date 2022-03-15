// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import React, { useCallback } from 'react';
// import React from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'antd/lib/modal';
import Menu from 'antd/lib/menu';
import { WorkoutStatus } from 'reducers/interfaces';
import { exportActions } from 'actions/export-ocellus-actions';

// import { deleteProjectAsync } from 'actions/projects-actions';
// import { exportActions } from 'actions/export-actions';

interface Props {
    workoutInstance: any;
}

export default function WorkoutActionsMenuComponent(props: Props): JSX.Element {
    const { workoutInstance } = props;
    const { status, id } = workoutInstance;

    const dispatch = useDispatch();

    const onDeleteWorkout = useCallback((): void => {
        Modal.confirm({
            title: `The workout ${id} will be deleted`,
            content: 'All related data will be lost. Continue?',
            className: 'cvat-modal-confirm-remove-workout',
            onOk: () => {
                console.log('DELETING WORKOUT :P');
                // dispatch(deleteProjectAsync(workoutInstance));
            },
            okButtonProps: {
                type: 'primary',
                danger: true,
            },
            okText: 'Delete',
        });
    }, []);

    const menuItems: JSX.Element[] = [];

    if (status === WorkoutStatus.TRAINING) {
        menuItems.push(
            <Menu.Item key='stop-workout' onClick={() => { console.log('stop workout:', workoutInstance); }}>
                Stop workout
            </Menu.Item>,
        );
    }

    if (status === WorkoutStatus.FINISHED) {
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
