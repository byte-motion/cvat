// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'antd/lib/modal';
import { useSelector, useDispatch } from 'react-redux';
import { GroupOutlined, RetweetOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import Select, { SelectValue } from 'antd/lib/select';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import { Tooltip, InputNumber } from 'antd';

import { CombinedState } from 'reducers/interfaces';
import { workoutActions, createWorkoutAsync } from 'actions/workouts-actions';
import { getAIfredDTLsAsync } from 'actions/aifred-dtls-actions';
import getCore from 'cvat-core-wrapper';
import { useHistory } from 'react-router';

const core = getCore();

type FormValues = {
    selectedWorkspace: number | undefined;
    selectedDTL: number | undefined;
    workoutName: string | undefined;
    iterations: number;
};

function CreateWorkoutModal(): JSX.Element {
    const [instanceType, setInstanceType] = useState('');

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const instance = useSelector((state: CombinedState) => state.workouts.instance);
    const modalVisible = useSelector((state: CombinedState) => state.workouts.modalVisible);
    const workspaces = [...useSelector((state: CombinedState) => state.aifredWorkspaces.workspaces)]
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
    const creates = useSelector((state: CombinedState) => state.workouts.activities.creates);
    const dtls = useSelector((state: CombinedState) => state.aifredDTLs.dtls);
    const [workspace] = useState(workspaces.length ? workspaces[0].id : undefined);
    const history = useHistory();

    const fetchDTLs = (workspaceId: number): void => {
        dispatch(getAIfredDTLsAsync(workspaceId));
    };

    const initActivities = (): void => {
        if (instance instanceof core.classes.Project) {
            setInstanceType('project');
        } else {
            setInstanceType('task');
        }

        fetchDTLs(workspace);
    };

    useEffect(() => {
        initActivities();
    }, [instance?.id, instance instanceof core.classes.Project, workspace]);

    useEffect(() => {
        if (creates.id && creates.error === '') {
            history.push('/workouts');
        }
    }, [creates]);

    const closeModal = (): void => {
        form.resetFields();
        dispatch(workoutActions.closeWorkoutModal());
    };

    const workspaceChange = (value: SelectValue): void => {
        form.setFieldsValue({ selectedDTL: undefined });
        fetchDTLs(Number(value));
    };

    const handleCreate = useCallback(
        (values: FormValues): void => {
            dispatch(createWorkoutAsync(
                instance,
                values.workoutName as string,
                values.selectedWorkspace as number,
                values.selectedDTL,
                values.iterations,
            ));
            closeModal();
        },
        [instance?.id, instance instanceof core.classes.Project, instanceType],
    );

    return (
        <Modal
            title={`Create workout for ${instanceType} #${instance?.id}`}
            visible={modalVisible}
            onCancel={closeModal}
            onOk={() => form.submit()}
            className={`cvat-modal-export-${instanceType}`}
            destroyOnClose
        >
            <Form
                name='Create workout'
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={
                    {
                        selectedWorkspace: workspace,
                        selectedDTL: undefined,
                        workoutName: undefined,
                        iterations: 10000,
                    } as FormValues
                }
                onFinish={handleCreate}
            >
                <Form.Item
                    name='selectedWorkspace'
                    label='Workspace'
                    rules={[{ required: true, message: 'Workspace must be selected' }]}
                >
                    <Select placeholder='Select workspace' className='cvat-modal-workout-select' onChange={workspaceChange}>
                        {workspaces
                            .map(
                                (ws: any): JSX.Element => (
                                    <Select.Option
                                        value={ws.id}
                                        key={ws.id}
                                        className='cvat-modal-workout-option-item'
                                    >
                                        <GroupOutlined />
                                        <Text>
                                            {`${ws.name} (${ws.description})`}
                                        </Text>
                                    </Select.Option>
                                ),
                            )}
                    </Select>
                </Form.Item>
                <Form.Item
                    name='selectedDTL'
                    label='Augmentation schema'
                    rules={[{ required: true, message: 'Augmentation schema is required' }]}
                >
                    <Select placeholder='Select schema' className='cvat-modal-workout-select'>
                        {dtls && dtls
                            .sort((a: any, b: any) => a.name.localeCompare(b.name))
                            .map(
                                (dtl: any): JSX.Element => (
                                    <Select.Option
                                        value={dtl.id}
                                        key={dtl.id}
                                        className='cvat-modal-workout-option-item'
                                    >
                                        <RetweetOutlined />
                                        <Tooltip title={dtl.description} placement='right'>
                                            <Text>{dtl.name}</Text>
                                        </Tooltip>
                                    </Select.Option>
                                ),
                            )}
                    </Select>
                </Form.Item>
                <Form.Item label='Workout name' name='workoutName' rules={[{ required: true, message: 'Workout name is required' }]}>
                    <Input
                        placeholder='Workout name'
                        className='cvat-modal-workout-name-input'
                    />
                </Form.Item>

                <Form.Item
                    label='Iterations number'
                    name='iterations'
                    rules={[
                        { required: true, message: 'Number of iterations is required' }]}
                    tooltip='Number of training loops'
                >
                    <InputNumber
                        placeholder='Number of iterations'
                        className='cvat-modal-workout-iterations-input'
                        min={1001}
                        precision={0}
                    />
                </Form.Item>

            </Form>
        </Modal>
    );
}

export default React.memo(CreateWorkoutModal);
