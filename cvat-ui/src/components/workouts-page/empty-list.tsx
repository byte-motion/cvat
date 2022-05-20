// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import React from 'react';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';
import Icon from '@ant-design/icons';

import { EmptyTasksIcon } from 'icons';

interface Props {
    notFound?: boolean;
}

export default function EmptyListComponent({ notFound }: Props): JSX.Element {
    return (
        <div className='cvat-empty-workouts-list'>
            <Row justify='center' align='middle'>
                <Col>
                    <Icon className='cvat-empty-workouts-icon' component={EmptyTasksIcon} />
                </Col>
            </Row>
            {notFound ? (
                <Row justify='center' align='middle'>
                    <Col>
                        <Text strong>No results matched your search...</Text>
                    </Col>
                </Row>
            ) : (
                <Row justify='center' align='middle'>
                    <Col>
                        <Text strong>No workouts created yet ...</Text>
                    </Col>
                </Row>
            )}
        </div>
    );
}
