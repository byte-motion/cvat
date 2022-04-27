// Copyright (C) 2019-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Spin from 'antd/lib/spin';
import { Row, Col } from 'antd/lib/grid';
import Result from 'antd/lib/result';

import { CombinedState } from 'reducers/interfaces';
import { getWorkoutAsync } from 'actions/workout-actions';
import DetailsComponent from './details';
import WorkoutTopBar from './top-bar';
import ValidationsComponent from './validations';
import MetricsComponent from './metrics';

interface ParamType {
    id: string;
}

export default function WorkoutPageComponent(): JSX.Element {
    const id = +useParams<ParamType>().id;
    const dispatch = useDispatch();

    const workout = useSelector((state: CombinedState) => state.workout.current?.instance);
    const workoutFetching = useSelector((state: CombinedState) => state.workout.fetching);

    useEffect(() => {
        dispatch(
            getWorkoutAsync(id),
        );
    }, [id, dispatch]);

    if (workoutFetching) {
        return <Spin size='large' className='cvat-spinner' />;
    }

    if (!workout) {
        return (
            <Result
                className='cvat-not-found'
                status='404'
                title='Sorry, but this workout was not found'
                subTitle='Please, be sure information you tried to get exist and you have access'
            />
        );
    }

    return (
        <Row justify='center' align='top' className='cvat-workout-page'>
            <Col md={22} lg={18} xl={16} xxl={14}>
                <WorkoutTopBar workoutInstance={workout} />
                <DetailsComponent workout={workout} />
                <MetricsComponent workout={workout} />
                <ValidationsComponent workout={workout} />
            </Col>
        </Row>
    );
}
