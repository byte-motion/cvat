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
                <Col>
                    <Text type='secondary'>
                        {`Workout #${workout.id} created`}
                        {workout.owner ? ` by ${workout.owner.name}` : null}
                        {` on ${moment(workout.createdDate).format('MMMM Do YYYY')}`}
                    </Text>
                </Col>
            </Row>
        </div>
    );
}
