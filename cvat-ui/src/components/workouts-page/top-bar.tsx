// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
// import Button from 'antd/lib/button';
import Text from 'antd/lib/typography/Text';
// import { PlusOutlined } from '@ant-design/icons';

import SearchField from 'components/search-field/search-field';
import { CombinedState, WorkoutsQuery } from 'reducers/interfaces';
import { getWorkoutsAsync } from 'actions/workouts-actions';

export default function TopBarComponent(): JSX.Element {
    // const history = useHistory();
    const dispatch = useDispatch();
    const query = useSelector((state: CombinedState) => state.workouts.gettingQuery);
    const dimensions = {
        md: 11,
        lg: 9,
        xl: 8,
        xxl: 8,
    };

    return (
        <Row justify='center' align='middle' className='cvat-workouts-top-bar'>
            <Col {...dimensions} span={8}>
                <Text className='cvat-title'>Workouts</Text>
                <SearchField
                    query={query}
                    instance='workout'
                    onSearch={(_query: WorkoutsQuery) => dispatch(getWorkoutsAsync(_query))}
                />
            </Col>
            <Col {...dimensions} span={16} />
        </Row>
    );
}
