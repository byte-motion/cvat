// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'antd/lib/grid';
import Pagination from 'antd/lib/pagination';

import { getWorkoutsAsync } from 'actions/workouts-actions';
import { CombinedState, Workout } from 'reducers/interfaces';
import WorkoutItem from './workout-item';

const dimensions = {
    md: 22,
    lg: 18,
    xl: 16,
    xxl: 16,
};

export default function WorkoutListComponent(): JSX.Element {
    const dispatch = useDispatch();
    const workoutsCount = useSelector((state: CombinedState) => state.workouts.count);
    const { page } = useSelector((state: CombinedState) => state.workouts.gettingQuery);
    const workouts = useSelector((state: CombinedState) => state.workouts.current);
    const gettingQuery = useSelector((state: CombinedState) => state.workouts.gettingQuery);

    const changePage = useCallback((p: number) => {
        dispatch(
            getWorkoutsAsync({
                ...gettingQuery,
                page: p,
            }),
        );
    }, [dispatch, getWorkoutsAsync, gettingQuery]);

    return (
        <>
            <Row justify='center' align='middle' className='cvat-workout-list-content'>
                <Col className='cvat-workouts-list' {...dimensions}>
                    {workouts.map(
                        (workout: Workout): JSX.Element => (
                            <WorkoutItem key={workout.instance.id} workoutInstance={workout} />
                        ),
                    )}
                </Col>
            </Row>
            <Row justify='center' align='middle'>
                <Col {...dimensions}>
                    <Pagination
                        className='cvat-workouts-pagination'
                        onChange={changePage}
                        showSizeChanger={false}
                        total={workoutsCount}
                        pageSize={12}
                        current={page}
                        showQuickJumper
                    />
                </Col>
            </Row>
        </>
    );
}
