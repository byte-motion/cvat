// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { useHistory } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
import Icon, { LeftOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Text from 'antd/lib/typography/Text';

import ActionsMenuContainer from 'containers/actions-menu/actions-menu';
import { MenuIcon } from 'icons';

interface DetailsComponentProps {
    taskInstance: any;
}

export default function DetailsComponent(props: DetailsComponentProps): JSX.Element {
    const { taskInstance } = props;

    const history = useHistory();

    const backButton = {
        name: 'tasks',
        url: '/tasks',
    };

    if (history.location.state?.from) {
        // little "magic" to use proper plural form ;)
        [backButton.name] = history.location.state.from.split('s/');
        backButton.url = `/${history.location.state.from}`;
    } else if (taskInstance.projectId) {
        backButton.name = 'project';
        backButton.url = `/projects/${taskInstance.projectId}`;
    }

    return (
        <Row className='cvat-task-top-bar' justify='space-between' align='middle'>
            <Col>
                <Button onClick={() => history.push(backButton.url)} type='link' size='large'>
                    <LeftOutlined />
                    {`Back to ${backButton.name}`}
                </Button>
            </Col>
            <Col>
                <Dropdown overlay={<ActionsMenuContainer taskInstance={taskInstance} />}>
                    <Button size='large'>
                        <Text className='cvat-text-color'>Actions</Text>
                        <Icon className='cvat-menu-icon' component={MenuIcon} />
                    </Button>
                </Dropdown>
            </Col>
        </Row>
    );
}
