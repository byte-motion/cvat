// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useCallback } from 'react';
import { connect } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MenuInfo } from 'rc-menu/lib/interface';

import ActionsMenuComponent, { Actions } from 'components/actions-menu/actions-menu';
import { CombinedState } from 'reducers/interfaces';

import { modelsActions } from 'actions/models-actions';
import {
    loadAnnotationsAsync,
    deleteTaskAsync,
    exportTaskAsync,
    switchMoveTaskModalVisible,
} from 'actions/tasks-actions';
import { exportActions } from 'actions/export-actions';
import { workoutActions } from 'actions/workouts-actions';

interface OwnProps {
    taskInstance: any;
}

interface StateToProps {
    annotationFormats: any;
    loadActivity: string | null;
    inferenceIsActive: boolean;
    exportIsActive: boolean;
    workspaces: any;
}

interface DispatchToProps {
    loadAnnotations: (taskInstance: any, loader: any, file: File) => void;
    showExportModal: (taskInstance: any) => void;
    deleteTask: (taskInstance: any) => void;
    openRunModelWindow: (taskInstance: any) => void;
    exportTask: (taskInstance: any) => void;
    openMoveTaskToProjectWindow: (taskInstance: any) => void;
    showWorkoutModal: (taskInstance: any) => void;
}

function mapStateToProps(state: CombinedState, own: OwnProps): StateToProps {
    const {
        taskInstance: { id: tid },
    } = own;

    const {
        formats: { annotationFormats },
        tasks: {
            activities: { loads, backups },
        },
        aifredWorkspaces: { workspaces },
    } = state;

    return {
        loadActivity: tid in loads ? loads[tid] : null,
        annotationFormats,
        inferenceIsActive: tid in state.models.inferences,
        exportIsActive: tid in backups,
        workspaces,
    };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        loadAnnotations: (taskInstance: any, loader: any, file: File): void => {
            dispatch(loadAnnotationsAsync(taskInstance, loader, file));
        },
        showExportModal: (taskInstance: any): void => {
            dispatch(exportActions.openExportModal(taskInstance));
        },
        deleteTask: (taskInstance: any): void => {
            dispatch(deleteTaskAsync(taskInstance));
        },
        openRunModelWindow: (taskInstance: any): void => {
            dispatch(modelsActions.showRunModelDialog(taskInstance));
        },
        exportTask: (taskInstance: any): void => {
            dispatch(exportTaskAsync(taskInstance));
        },
        openMoveTaskToProjectWindow: (taskId: number): void => {
            dispatch(switchMoveTaskModalVisible(true, taskId));
        },
        showWorkoutModal: (taskInstance: any): void => {
            dispatch(workoutActions.openWorkoutModal(taskInstance));
        },
    };
}

function ActionsMenuContainer(props: OwnProps & StateToProps & DispatchToProps): JSX.Element {
    const {
        taskInstance,
        annotationFormats: { loaders, dumpers },
        loadActivity,
        inferenceIsActive,
        exportIsActive,
        loadAnnotations,
        showExportModal,
        deleteTask,
        openRunModelWindow,
        exportTask,
        openMoveTaskToProjectWindow,
        showWorkoutModal,
    } = props;

    const onClickMenu = useCallback(
        (params: MenuInfo) => {
            const [action] = params.keyPath;
            if (action === Actions.EXPORT_TASK_DATASET) {
                showExportModal(taskInstance);
            } else if (action === Actions.DELETE_TASK) {
                deleteTask(taskInstance);
            } else if (action === Actions.OPEN_BUG_TRACKER) {
                window.open(`${taskInstance.bugTracker}`, '_blank');
            } else if (action === Actions.RUN_AUTO_ANNOTATION) {
                openRunModelWindow(taskInstance);
            } else if (action === Actions.EXPORT_TASK) {
                exportTask(taskInstance);
            } else if (action === Actions.MOVE_TASK_TO_PROJECT) {
                openMoveTaskToProjectWindow(taskInstance.id);
            } else if (action === Actions.CREATE_WORKOUT) {
                showWorkoutModal(taskInstance);
            }
        },
        [taskInstance],
    );

    const onUploadAnnotations = useCallback(
        (format: string, file: File) => {
            const [loader] = loaders.filter((_loader: any): boolean => _loader.name === format);
            if (loader && file) {
                loadAnnotations(taskInstance, loader, file);
            }
        },
        [taskInstance],
    );

    return (
        <ActionsMenuComponent
            taskID={taskInstance.id}
            taskMode={taskInstance.mode}
            bugTracker={taskInstance.bugTracker}
            loaders={loaders}
            dumpers={dumpers}
            loadActivity={loadActivity}
            inferenceIsActive={inferenceIsActive}
            onClickMenu={onClickMenu}
            onUploadAnnotations={onUploadAnnotations}
            taskDimension={taskInstance.dimension}
            exportIsActive={exportIsActive}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsMenuContainer);
