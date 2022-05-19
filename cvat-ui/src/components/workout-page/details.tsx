// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import moment from 'moment';
import { Table } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import Title from 'antd/lib/typography/Title';
import Button from 'antd/lib/button';
import Text from 'antd/lib/typography/Text';
import { updateWorkoutAsync } from 'actions/workout-actions';
import ProgressBarComponent from './progress-bar';

interface DetailsComponentProps {
    workout: any;
}

export default function DetailsComponent(props: DetailsComponentProps): JSX.Element {
    const { workout } = props;

    const dispatch = useDispatch();
    const [workoutName, setWorkoutName] = useState(workout.name);
    const history = useHistory();

    const [dataType, dataId] = workout.data_url.split('/').slice(-2);

    const preview = (
        <div className='cvat-workout-preview-wrapper'>
            {workout.preview && (
                <img alt='Preview' className='cvat-task-item-preview' src={workout.preview} />
            )}
        </div>
    );

    const histogramColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Number of instances',
            dataIndex: 'instances',
            key: 'instances',
        },
        {
            title: '%',
            dataIndex: 'percent',
            key: 'percent',
        },
    ];

    const histogramData = (Object.keys(workout.histogram).length > 0) ? workout.histogram?.classes.map(
        (item: any): { key: string, name: string; instances: number; percent: number; } => (
            {
                ...item,
                percent: Math.round((item.instances / workout.histogram.total) * 100),
                key: item.name,
            }
        ),
    ) : null;

    const histogram = (
        <Row justify='space-between' className='cvat-workout-classes'>

            {(histogramData !== null) && (
                <Col span={24}>
                    <Text strong>Classes:</Text>
                    <Table columns={histogramColumns} dataSource={histogramData} />
                </Col>
            )}
        </Row>
    );

    return (
        <div cvat-workout-id={workout.id} className='cvat-workout-details'>
            <Row>
                <Col span={12}>
                    <Title
                        level={4}
                        editable={{
                            onChange: (value: string): void => {
                                setWorkoutName(value);
                                workout.name = value;
                                dispatch(updateWorkoutAsync(workout));
                            },
                        }}
                        className='cvat-text-color cvat-workout-name'
                    >
                        {workoutName}
                    </Title>
                </Col>
            </Row>
            <Row justify='space-between' className='cvat-workout-description'>
                <Col md={8} lg={7} xl={7} xxl={6}>
                    <Row justify='start' align='middle'>
                        <Col span={24}>{preview}</Col>
                    </Row>
                </Col>
                <Col md={16} lg={17} xl={17} xxl={18}>
                    <Row>
                        <Col span={24}>
                            <Text strong>
                                {`Workout #${workout.id} created`}
                                {workout.owner ? ` by ${workout.owner.name}` : null}
                                {` on ${moment(workout.createdDate).format('MMMM Do YYYY')}`}
                            </Text>
                        </Col>
                        <Col span={24}>
                            <Text type='secondary'>
                                {`Used augmentation schema: ${workout.dtl.name} (${workout.dtl.description})`}
                            </Text>
                        </Col>
                        <Col span={24}>
                            <Text type='secondary'>
                                Used data set:
                                <Button
                                    href={`/${dataType}/${dataId}`}
                                    type='text'
                                    onClick={(e: React.MouseEvent): void => {
                                        e.preventDefault();
                                        history.push(`/${dataType}/${dataId}`, { from: `workouts/${workout.id}` });
                                    }}
                                >
                                    {`${dataType.slice(0, -1)} #${dataId}`}
                                </Button>
                            </Text>
                        </Col>
                    </Row>
                    <Row>
                        <ProgressBarComponent workout={workout} span={24} />
                    </Row>
                    {histogram}
                </Col>
            </Row>
        </div>
    );
}
