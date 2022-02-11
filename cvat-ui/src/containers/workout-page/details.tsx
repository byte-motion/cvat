// Copyright (C) 2019-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { connect } from 'react-redux';

import DetailsComponent from 'components/workout-page/details';
import { updateWorkoutAsync } from 'actions/workouts-actions';
import { cancelInferenceAsync } from 'actions/models-actions';
import { Workout, CombinedState, ActiveInference } from 'reducers/interfaces';

interface OwnProps {
    workout: Workout;
}

interface StateToProps {
    activeInference: ActiveInference | null;
    installedGit: boolean;
    projectSubsets: string[];
}

interface DispatchToProps {
    cancelAutoAnnotation(): void;
    onWorkoutUpdate: (workoutInstance: any) => void;
}

function mapStateToProps(state: CombinedState, own: OwnProps): StateToProps {
    const { list } = state.plugins;
    const [taskProject] = state.projects.current.filter((project) => project.id === own.task.instance.projectId);

    return {
        installedGit: list.GIT_INTEGRATION,
        activeInference: state.models.inferences[own.workout.instance.id] || null,
        projectSubsets: taskProject ?
            ([
                ...new Set(taskProject.tasks.map((task: any) => task.subset).filter((subset: string) => subset)),
            ] as string[]) :
            [],
    };
}

function mapDispatchToProps(dispatch: any, own: OwnProps): DispatchToProps {
    return {
        onWorkoutUpdate(workoutInstance: any): void {
            dispatch(updateWorkoutAsync(workoutInstance));
        },
        cancelAutoAnnotation(): void {
            dispatch(cancelInferenceAsync(own.workout.instance.id));
        },
    };
}

function WorkoutPageContainer(props: StateToProps & DispatchToProps & OwnProps): JSX.Element {
    const {
        workout, installedGit, activeInference, projectSubsets, cancelAutoAnnotation, onWorkoutUpdate,
    } = props;

    return (
        <DetailsComponent
            previewImage={workout.preview}
            workoutInstance={workout.instance}
            installedGit={installedGit}
            activeInference={activeInference}
            projectSubsets={projectSubsets}
            onWorkoutUpdate={onWorkoutUpdate}
            cancelAutoAnnotation={cancelAutoAnnotation}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutPageContainer);
