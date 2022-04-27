// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { ExportActions, ExportActionTypes } from 'actions/export-ocellus-actions';

import { OcellusExportState } from './interfaces';

const defaultState: OcellusExportState = {
    workout: null,
    modalVisible: false,
};

export default (state: OcellusExportState = defaultState, action: ExportActions): OcellusExportState => {
    switch (action.type) {
        case ExportActionTypes.OPEN_EXPORT_OCELLUS_MODEL_MODAL:
            return {
                ...state,
                modalVisible: true,
                workout: action.payload.workout,
            };
        case ExportActionTypes.CLOSE_EXPORT_OCELLUS_MODEL_MODAL:
            return {
                ...state,
                modalVisible: false,
                workout: null,
            };
        case ExportActionTypes.EXPORT_OCELLUS_MODEL:
            return {
                ...state,
                ...action.payload,
            };
        case ExportActionTypes.EXPORT_OCELLUS_MODEL_FAILED:
        case ExportActionTypes.EXPORT_OCELLUS_MODEL_SUCCESS: {
            return {
                ...state,
                ...action.payload,
            };
        }
        default:
            return state;
    }
};
