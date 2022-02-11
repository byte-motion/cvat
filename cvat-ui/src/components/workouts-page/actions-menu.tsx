// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'antd/lib/modal';
import Menu from 'antd/lib/menu';

// import { deleteProjectAsync } from 'actions/projects-actions';
import { exportActions } from 'actions/export-actions';

interface Props {
    workoutInstance: any;
}

export default function WorkoutActionsMenuComponent(props: Props): JSX.Element {
    const { workoutInstance } = props;

    const dispatch = useDispatch();

    const onDeleteWorkout = useCallback((): void => {
        Modal.confirm({
            title: `The workout ${workoutInstance.id} will be deleted`,
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

    return (
        <Menu selectable={false} className='cvat-workout-actions-menu'>
            <Menu.Item key='export-dataset' onClick={() => dispatch(exportActions.openExportModal(workoutInstance))}>
                Stop workout
            </Menu.Item>
            <Menu.Item key='import-dataset' onClick={() => dispatch(importActions.openImportModal(workoutInstance))}>
                Resume workout
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key='delete' onClick={onDeleteWorkout}>
                Delete
            </Menu.Item>
        </Menu>
    );
}
