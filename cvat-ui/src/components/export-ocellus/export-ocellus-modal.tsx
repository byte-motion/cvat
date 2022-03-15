// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useCallback } from 'react';
import Modal from 'antd/lib/modal';
import Notification from 'antd/lib/notification';
import { useSelector, useDispatch } from 'react-redux';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';

import { CombinedState } from 'reducers/interfaces';
import { exportActions, exportModelAsync } from 'actions/export-ocellus-actions';
// import getCore from 'cvat-core-wrapper';

// const core = getCore();

type FormValues = {
    fileName: string | undefined;
};

function ExportOcellusModelModal(): JSX.Element {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const workout = useSelector((state: CombinedState) => state.exportOcellus.workout);
    const modalVisible = useSelector((state: CombinedState) => state.exportOcellus.modalVisible);

    const closeModal = (): void => {
        form.resetFields();
        dispatch(exportActions.closeExportModal());
    };

    const handleExport = useCallback(
        (values: FormValues): void => {
            // have to validate format before so it would not be undefined
            const fileName = values.fileName ? values.fileName : '';
            dispatch(
                exportModelAsync(
                    workout.id,
                    fileName,
                ),
            );
            closeModal();
            Notification.info({
                message: 'Dataset export started',
                description:
                    `Ocellus model export was started for Workout '${workout.name}' #${workout.id}. ` +
                    'Download will start automatically as soon as the model file is ready.',
                className: 'cvat-notification-notice-export-ocellus-start',
            });
        },
        [workout],
    );

    return (
        <Modal
            title={`Export Ocellus model for '${workout?.name}' #${workout?.id}`}
            visible={modalVisible}
            onCancel={closeModal}
            onOk={() => form.submit()}
            className='cvat-modal-export-ocellus'
            destroyOnClose
        >
            <Form
                name='Export Ocellus model'
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={
                    {
                        fileName: undefined,
                    } as FormValues
                }
                onFinish={handleExport}
            >
                <Form.Item label='Model name' name='fileName' rules={[{ required: true, message: 'Filename is mandatory' }]}>
                    <Input
                        placeholder='Ocellus model filename'
                        className='cvat-modal-export-filename-input'
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default React.memo(ExportOcellusModelModal);
