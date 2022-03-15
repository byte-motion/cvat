// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import React from 'react';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';
import { Workout, WorkoutStatus } from 'reducers/interfaces';
import Progress from 'antd/lib/progress';

interface Props {
    workout: Workout['instance'];
    span: number;
}

export default function ProgressBarComponent(props: Props): JSX.Element {
    const { workout, span } = props;
    const { status } = workout;

    const formatSeconds = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds / 60) % 60;
        const secs = seconds % 60;

        return `${hours}h ${minutes}m ${secs}s`;
    };
    const numOfIterations = workout.iterations;
    const numOfCompleted = workout.iteration;
    const timeLeft = (workout.eta < 0) ? 'N/A' : formatSeconds(workout.eta);

    let progressColor = null;
    if (status === WorkoutStatus.FINISHED) {
        progressColor = 'cvat-workout-completed-progress';
    } else if (status === WorkoutStatus.ERROR) {
        progressColor = 'cvat-workout-error-progress';
    } else if ([WorkoutStatus.STOPPED, WorkoutStatus.QUEUED, WorkoutStatus.NEW].includes(status)) {
        progressColor = 'cvat-workout-pending-progress';
    } else {
        progressColor = 'cvat-workout-progress-progress';
    }

    const progressText = (
        <Text strong className={progressColor}>
            {status}
        </Text>
    );

    const workoutProgress = numOfCompleted / numOfIterations;

    return (
        <Col span={span}>
            <Row justify='space-between' align='top'>
                <Col>
                    <svg height='8' width='8' className={progressColor}>
                        <circle cx='4' cy='4' r='4' strokeWidth='0' />
                    </svg>
                    {progressText}
                </Col>
                <Col>
                    <Text type='secondary'>{`${numOfCompleted} of ${numOfIterations} iterations`}</Text>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Progress
                        className={`${progressColor} cvat-workout-progress`}
                        percent={workoutProgress * 100}
                        strokeColor='#1890FF'
                        showInfo={false}
                        strokeWidth={5}
                        size='small'
                    />
                </Col>
            </Row>
            <Row justify='space-between' align='top'>
                <Col span={24}>
                    <Text type='secondary'>{`ETA: ${timeLeft}`}</Text>
                </Col>
            </Row>
        </Col>
    );
}
