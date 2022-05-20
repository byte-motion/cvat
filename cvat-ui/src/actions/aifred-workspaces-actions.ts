// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import { ActionUnion, createAction, ThunkAction } from 'utils/redux';
import getCore from 'cvat-core-wrapper';

const cvat = getCore();

export enum AIfredWorkspacesActionTypes {
    GET_WORKSPACES = 'GET_AIFRED_WORKSPACES',
    GET_WORKSPACES_SUCCESS = 'GET_AIFRED_WORKSPACES_SUCCESS',
    GET_WORKSPACES_FAILED = 'GET_AIFRED_WORKSPACES_FAILED',
}

const workspacesActions = {
    getWorkspaces: () => createAction(AIfredWorkspacesActionTypes.GET_WORKSPACES),
    getWorkspacesSuccess: (workspaces: any) => (
        createAction(AIfredWorkspacesActionTypes.GET_WORKSPACES_SUCCESS, {
            workspaces,
        })
    ),
    getWorkspacesFailed: (error: any) => createAction(AIfredWorkspacesActionTypes.GET_WORKSPACES_FAILED, { error }),
};

export type AIfredWorkspacesActions = ActionUnion<typeof workspacesActions>;

export const getAIfredWorkspacesAsync = (): ThunkAction => async (dispatch): Promise<void> => {
    dispatch(workspacesActions.getWorkspaces());
    try {
        const workspaces = await cvat.aifred.workspaces();
        dispatch(workspacesActions.getWorkspacesSuccess(workspaces));
    } catch (error) {
        dispatch(workspacesActions.getWorkspacesFailed(error));
    }
};
