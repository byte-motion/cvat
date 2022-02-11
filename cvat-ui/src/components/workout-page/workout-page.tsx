// Copyright (C) 2019-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
// import { useHistory, useParams, useLocation } from 'react-router';
import Spin from 'antd/lib/spin';
import { Row, Col } from 'antd/lib/grid';
import Result from 'antd/lib/result';
// import Button from 'antd/lib/button';
// import Title from 'antd/lib/typography/Title';
// import Pagination from 'antd/lib/pagination';
// import { PlusOutlined } from '@ant-design/icons';

import { CombinedState } from 'reducers/interfaces';
// import { getWorkoutsAsync } from 'actions/workouts-actions';
// import { cancelInferenceAsync } from 'actions/models-actions';
// import TaskItem from 'components/tasks-page/task-item';
// import SearchField from 'components/search-field/search-field';
// import MoveTaskModal from 'components/move-task-modal/move-task-modal';
// import ModelRunnerDialog from 'components/model-runner-modal/model-runner-dialog';
// import ImportDatasetModal from 'components/import-dataset-modal/import-dataset-modal';
// import { useDidUpdateEffect } from 'utils/hooks';
import DetailsComponent from './details';
import WorkoutTopBar from './top-bar';

interface ParamType {
    id: string;
}

export default function WorkoutPageComponent(): JSX.Element {
    const id = +useParams<ParamType>().id;
    // const history = useHistory();
    const workouts = useSelector((state: CombinedState) => state.workouts.current).map((workout) => workout.instance);
    const workoutsFetching = useSelector((state: CombinedState) => state.workouts.fetching);
    // const deletes = useSelector((state: CombinedState) => state.workouts.activities.deletes);
    // const taskDeletes = useSelector((state: CombinedState) => state.tasks.activities.deletes);
    // const tasksActiveInferences = useSelector((state: CombinedState) => state.models.inferences);
    // const tasks = useSelector((state: CombinedState) => state.tasks.current);
    // const tasksCount = useSelector((state: CombinedState) => state.tasks.count);
    // const tasksGettingQuery = useSelector((state: CombinedState) => state.workouts.tasksGettingQuery);

    const [workout] = workouts.filter((_workout) => _workout.id === id);
    // const workoutSubsets: Array<string> = [];
    // for (const task of tasks) {
    //     if (!workoutSubsets.includes(task.instance.subset)) workoutSubsets.push(task.instance.subset);
    // }

    // const deleteActivity = workout && id in deletes ? deletes[id] : null;

    // const onPageChange = useCallback(
    //     (p: number) => {
    //         dispatch(getWorkoutTasksAsync({
    //             workoutId: id,
    //             page: p,
    //         }));
    //     },
    //     [],
    // );

    // useEffect(() => {
    //     const searchParams: Partial<TasksQuery> = {};
    //     for (const [param, value] of new URLSearchParams(search)) {
    //         searchParams[param] = ['page'].includes(param) ? Number.parseInt(value, 10) : value;
    //     }
    //     dispatch(getWorkoutsAsync({ id }, searchParams));
    // }, []);

    // useDidUpdateEffect(() => {
    //     const searchParams = new URLSearchParams();
    //     for (const [name, value] of Object.entries(tasksGettingQuery)) {
    //         if (value !== null && typeof value !== 'undefined' && !['workoutId', 'ordering'].includes(name)) {
    //             searchParams.append(name, value.toString());
    //         }
    //     }
    //     history.push({
    //         pathname: `/workouts/${id}`,
    //         search: `?${searchParams.toString()}`,
    //     });
    // }, [tasksGettingQuery, id]);

    // if (deleteActivity) {
    //     history.push('/workouts');
    // }

    if (workoutsFetching) {
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

    // const paginationDimensions = {
    //     md: 22,
    //     lg: 18,
    //     xl: 16,
    //     xxl: 16,
    // };

    return (
        <Row justify='center' align='top' className='cvat-workout-page'>
            <Col md={22} lg={18} xl={16} xxl={14}>
                <WorkoutTopBar workoutInstance={workout} />
                <DetailsComponent workout={workout} />
            </Col>
        </Row>
    );
}
