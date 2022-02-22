// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import moment from 'moment';
import { Row, Col } from 'antd/lib/grid';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';

// import getCore from 'cvat-core-wrapper';
// import LabelsEditor from 'components/labels-editor/labels-editor';
// import BugTrackerEditor from 'components/task-page/bug-tracker-editor';
// import UserSelector from 'components/task-page/user-selector';

// const core = getCore();

interface DetailsComponentProps {
    workout: any;
}

export default function DetailsComponent(props: DetailsComponentProps): JSX.Element {
    const { workout } = props;

    // const dispatch = useDispatch();
    const [workoutName, setWorkoutName] = useState(workout.name);

    const preview = (
        <div className='cvat-workout-preview-wrapper'>
            {workout.preview && (
                <img alt='Preview' className='cvat-task-item-preview' src={workout.preview} />
            )}
        </div>
    );

    console.log('WERKOUT', workout);

    return (
        <div cvat-workout-id={workout.id} className='cvat-workout-details'>
            <Row>
                <Col>
                    <Title
                        level={4}
                        editable={{
                            onChange: (value: string): void => {
                                setWorkoutName(value);
                                workout.name = value;
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
                            <Text type='secondary'>
                                {`Workout #${workout.id} created`}
                                {workout.owner ? ` by ${workout.owner.name}` : null}
                                {` on ${moment(workout.createdDate).format('MMMM Do YYYY')}`}
                            </Text>
                        </Col>
                        <Col span={24}>
                            <Text>
                                Augmentation schema:
                                {' '}
                                {`${workout.dtl.name} (${workout.dtl.description})`}
                            </Text>
                        </Col>
                        <Col span={24}>
                            <Text>
                                Iteration steps:
                                {' '}
                                {workout.iterations}
                            </Text>
                        </Col>
                        <Col span={24}>
                            <Text>
                                Status:
                                {' '}
                                {workout.status}
                            </Text>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
