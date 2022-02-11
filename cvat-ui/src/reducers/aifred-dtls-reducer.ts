// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import { BoundariesActions, BoundariesActionTypes } from 'actions/boundaries-actions';
import { AIfredDTLsActionTypes, AIfredDTLsActions } from 'actions/aifred-dtls-actions';
import { AuthActionTypes, AuthActions } from 'actions/auth-actions';

import { AIfredDTLsState } from './interfaces';

const defaultState: AIfredDTLsState = {
    dtls: null,
    initialized: false,
    fetching: false,
};

export default (
    state: AIfredDTLsState = defaultState,
    action: AIfredDTLsActions | AuthActions | BoundariesActions,
): AIfredDTLsState => {
    switch (action.type) {
        case AIfredDTLsActionTypes.GET_DTLS: {
            return {
                ...state,
                fetching: true,
                initialized: false,
            };
        }
        case AIfredDTLsActionTypes.GET_DTLS_SUCCESS:
            return {
                ...state,
                initialized: true,
                fetching: false,
                dtls: action.payload.dtls,
            };
        case AIfredDTLsActionTypes.GET_DTLS_FAILED:
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
