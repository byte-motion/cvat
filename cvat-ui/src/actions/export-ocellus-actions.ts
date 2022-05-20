// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { ActionUnion, createAction, ThunkAction } from 'utils/redux';
import getCore from 'cvat-core-wrapper';

const cvat = getCore();

export enum ExportActionTypes {
    OPEN_EXPORT_OCELLUS_MODEL_MODAL = 'OPEN_EXPORT_OCELLUS_MODEL_MODAL',
    CLOSE_EXPORT_OCELLUS_MODEL_MODAL = 'CLOSE_EXPORT_OCELLUS_MODEL_MODAL',
    EXPORT_OCELLUS_MODEL = 'EXPORT_OCELLUS_MODEL',
    EXPORT_OCELLUS_MODEL_SUCCESS = 'EXPORT_OCELLUS_MODEL_SUCCESS',
    EXPORT_OCELLUS_MODEL_FAILED = 'EXPORT_OCELLUS_MODEL_FAILED',
}

export const exportActions = {
    openExportModal: (workout: any) => createAction(ExportActionTypes.OPEN_EXPORT_OCELLUS_MODEL_MODAL, { workout }),
    closeExportModal: () => createAction(ExportActionTypes.CLOSE_EXPORT_OCELLUS_MODEL_MODAL),
    exportModel: (workout: any, fileName: string) => (
        createAction(ExportActionTypes.EXPORT_OCELLUS_MODEL, { workout, fileName })
    ),
    exportModelSuccess: (workout: any, fileName: string) => (
        createAction(ExportActionTypes.EXPORT_OCELLUS_MODEL_SUCCESS, { workout, fileName })
    ),
    exportModelFailed: (workout: any, fileName: string, error: any) => (
        createAction(ExportActionTypes.EXPORT_OCELLUS_MODEL_FAILED, {
            workout,
            fileName,
            error,
        })
    ),
};

export const exportModelAsync = (
    workoutId: number,
    fileName: string,
): ThunkAction => async (dispatch) => {
    dispatch(exportActions.exportModel(workoutId, fileName));

    try {
        const url = await cvat.aifred.getOcellusModel(workoutId, fileName);
        const downloadAnchor = window.document.getElementById('downloadAnchor') as HTMLAnchorElement;
        downloadAnchor.href = url;
        downloadAnchor.setAttribute('download', fileName);
        downloadAnchor.click();

        // Clean up after download as this is memory consuming thing.
        downloadAnchor.setAttribute('download', '');
        downloadAnchor.href = '';
        dispatch(exportActions.exportModelSuccess(workoutId, fileName));
    } catch (error) {
        dispatch(exportActions.exportModelFailed(workoutId, fileName, error));
    }
};

export type ExportActions = ActionUnion<typeof exportActions>;
