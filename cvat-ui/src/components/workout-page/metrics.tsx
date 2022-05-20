// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useEffect } from 'react';
import Title from 'antd/lib/typography/Title';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/lib/spin';

import { getWorkoutMetricsAsync } from 'actions/workout-actions';
import { CombinedState } from 'reducers/interfaces';
import EmptyListComponent from './empty-list';

interface MetricsComponentProps {
    workout: any;
}

export default function MetricsComponent(props: MetricsComponentProps): JSX.Element {
    const { workout } = props;

    const dispatch = useDispatch();

    const metrics = useSelector((state: CombinedState) => state.workout.activities.metrics.image);
    const metricsFetching = useSelector((state: CombinedState) => state.workout.activities.metrics.fetching);

    useEffect(() => {
        dispatch(
            getWorkoutMetricsAsync(workout),
        );
    }, [workout, dispatch]);

    let metricsElement = null;
    if (metricsFetching) {
        metricsElement = <Spin key={workout.id} size='small' className='cvat-spinner' />;
    } else if (metrics) {
        metricsElement = (
            <div key='metrics' className='cvat-workout-image-container'>
                <img key='metrics' alt={workout.id} className='cvat-task-item-preview' src={metrics} />
            </div>
        );
    } else {
        metricsElement = <EmptyListComponent message='No metrics...' />;
    }

    return (
        <div className='cvat-workout-details'>
            <Title level={4} className='cvat-text-color cvat-workout-name'>
                Metrics
            </Title>
            {metricsElement}
        </div>
    );
}
