// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import { ActionUnion, createAction, ThunkAction } from 'utils/redux';
import getCore from 'cvat-core-wrapper';

const cvat = getCore();

export enum AIfredDTLsActionTypes {
    GET_DTLS = 'GET_AIFRED_DTLS',
    GET_DTLS_SUCCESS = 'GET_AIFRED_DTLS_SUCCESS',
    GET_DTLS_FAILED = 'GET_AIFRED_DTLS_FAILED',
}

const dtlsActions = {
    getDTLs: () => createAction(AIfredDTLsActionTypes.GET_DTLS),
    getDTLsSuccess: (dtls: any) => (
        createAction(AIfredDTLsActionTypes.GET_DTLS_SUCCESS, {
            dtls,
        })
    ),
    getDTLsFailed: (error: any) => createAction(AIfredDTLsActionTypes.GET_DTLS_FAILED, { error }),
};

export type AIfredDTLsActions = ActionUnion<typeof dtlsActions>;

export function getAIfredDTLsAsync(workspaceId: number): ThunkAction {
    return async (dispatch): Promise<void> => {
        dispatch(dtlsActions.getDTLs());
        let dtls = null;

        try {
            dtls = await cvat.aifred.dtls(workspaceId);

            dispatch(dtlsActions.getDTLsSuccess(dtls));
        } catch (error) {
            dispatch(dtlsActions.getDTLsFailed(error));
        }
    };
}
