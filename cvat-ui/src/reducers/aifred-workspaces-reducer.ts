// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import { BoundariesActions, BoundariesActionTypes } from 'actions/boundaries-actions';
import { AIfredWorkspacesActionTypes, AIfredWorkspacesActions } from 'actions/aifred-workspaces-actions';
import { AuthActionTypes, AuthActions } from 'actions/auth-actions';

import { AIfredWorkspacesState } from './interfaces';

const defaultState: AIfredWorkspacesState = {
    workspaces: null,
    initialized: false,
    fetching: false,
};

export default (
    state: AIfredWorkspacesState = defaultState,
    action: AIfredWorkspacesActions | AuthActions | BoundariesActions,
): AIfredWorkspacesState => {
    switch (action.type) {
        case AIfredWorkspacesActionTypes.GET_WORKSPACES: {
            return {
                ...state,
                fetching: true,
                initialized: false,
            };
        }
        case AIfredWorkspacesActionTypes.GET_WORKSPACES_SUCCESS:
            return {
                ...state,
                initialized: true,
                fetching: false,
                workspaces: action.payload.workspaces,
            };
        case AIfredWorkspacesActionTypes.GET_WORKSPACES_FAILED:
            return {
                ...state,
                initialized: true,
                fetching: false,
            };
        case BoundariesActionTypes.RESET_AFTER_ERROR:
        case AuthActionTypes.LOGOUT_SUCCESS: {
            return { ...defaultState };
        }
        default:
            return state;
    }
};
