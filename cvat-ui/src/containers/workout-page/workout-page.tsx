// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import { getWorkoutsAsync } from 'actions/workouts-actions';

import TaskPageComponent from 'components/workout-page/workout-page';
import { Task, CombinedState } from 'reducers/interfaces';

type Props = RouteComponentProps<{ id: string }>;

interface StateToProps {
    task: Task | null | undefined;
    fetching: boolean;
    updating: boolean;
    deleteActivity: boolean | null;
    installedGit: boolean;
}

interface DispatchToProps {
    getWorkout: () => void;
}

function mapStateToProps(state: CombinedState, own: Props): StateToProps {
    const { list } = state.plugins;
    const { tasks } = state;
    const { gettingQuery, fetching, updating } = tasks;
    const { deletes } = tasks.activities;

    const id = +own.match.params.id;

    const filteredTasks = state.tasks.current.filter((task) => task.instance.id === id);

    const task = filteredTasks[0] || (gettingQuery.id === id || Number.isNaN(id) ? undefined : null);

    let deleteActivity = null;
    if (task && id in deletes) {
        deleteActivity = deletes[id];
    }

    return {
        task,
        deleteActivity,
        fetching,
        updating,
        installedGit: list.GIT_INTEGRATION,
    };
}

function mapDispatchToProps(dispatch: any, own: Props): DispatchToProps {
    const id = +own.match.params.id;

    return {
        getWorkout: (): void => {
            dispatch(
                getWorkoutsAsync({
                    id,
                    page: 1,
                    search: null,
                    status: null,
                }),
            );
        },
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TaskPageComponent));
