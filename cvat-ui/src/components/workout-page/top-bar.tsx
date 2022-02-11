// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { useHistory } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
import Icon, { LeftOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Text from 'antd/lib/typography/Text';

import { Workout } from 'reducers/interfaces';
import ActionsMenu from 'components/workouts-page/actions-menu';
import { MenuIcon } from 'icons';

interface DetailsComponentProps {
    workoutInstance: Workout;
}

export default function WorkoutTopBar(props: DetailsComponentProps): JSX.Element {
    const { workoutInstance } = props;

    const history = useHistory();

    return (
        <Row className='cvat-task-top-bar' justify='space-between' align='middle'>
            <Col>
                <Button onClick={() => history.push('/workouts')} type='link' size='large'>
                    <LeftOutlined />
                    Back to workouts
                </Button>
            </Col>
            <Col className='cvat-workout-top-bar-actions'>
                <Dropdown overlay={<ActionsMenu workoutInstance={workoutInstance} />}>
                    <Button size='large'>
                        <Text className='cvat-text-color'>Actions</Text>
                        <Icon className='cvat-menu-icon' component={MenuIcon} />
                    </Button>
                </Dropdown>
            </Col>
        </Row>
    );
}
