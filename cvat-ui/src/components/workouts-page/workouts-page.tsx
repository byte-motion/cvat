// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import './styles.scss';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router';
import Spin from 'antd/lib/spin';

import { CombinedState, WorkoutsQuery } from 'reducers/interfaces';
import { getWorkoutsAsync } from 'actions/workouts-actions';

import FeedbackComponent from 'components/feedback/feedback';
import EmptyListComponent from './empty-list';
import TopBarComponent from './top-bar';
import WorkoutListComponent from './workout-list';

export default function WorkoutsPageComponent(): JSX.Element {
    const { search } = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const workoutFetching = useSelector((state: CombinedState) => state.workouts.fetching);
    const workoutsCount = useSelector((state: CombinedState) => state.workouts.current.length);
    const gettingQuery = useSelector((state: CombinedState) => state.workouts.gettingQuery);

    const anySearchQuery = !!Array.from(new URLSearchParams(search).keys()).filter((value) => value !== 'page').length;

    useEffect(() => {
        const searchParams: Partial<WorkoutsQuery> = {};
        for (const [param, value] of new URLSearchParams(search)) {
            searchParams[param] = ['page', 'id', 'task', 'project'].includes(param) ? Number.parseInt(value, 10) : value;
        }
        dispatch(getWorkoutsAsync(searchParams));
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams();
        for (const [name, value] of Object.entries(gettingQuery)) {
            if (value !== null && typeof value !== 'undefined') {
                searchParams.append(name, value.toString());
            }
        }
        history.push({
            pathname: '/workouts',
            search: `?${searchParams.toString()}`,
        });
    }, [gettingQuery]);

    if (workoutFetching) {
        return <Spin size='large' className='cvat-spinner' />;
    }

    return (
        <div className='cvat-workouts-page'>
            <TopBarComponent />
            {workoutsCount ? <WorkoutListComponent /> : <EmptyListComponent notFound={anySearchQuery} />}
            <FeedbackComponent />
        </div>
    );
}
