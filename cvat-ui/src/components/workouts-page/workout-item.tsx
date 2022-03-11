// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT
import React from 'react';
import moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import Progress from 'antd/lib/progress';
import Button from 'antd/lib/button';
import { Row, Col } from 'antd/lib/grid';
import { Dropdown } from 'antd';
import Icon from '@ant-design/icons';
import { MenuIcon } from 'icons';

import { Workout, WorkoutStatus } from 'reducers/interfaces';
import WorkoutActionsMenuComponent from './actions-menu';
import ProgressBarComponent from '../workout-page/progress-bar';

interface Props {
    workoutInstance: Workout;
}

class WorkoutItemComponent extends React.PureComponent<Props & RouteComponentProps> {
    private formatSeconds(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds / 60) % 60;
        const secs = seconds % 60;

        return `${hours}h ${minutes}m ${secs}s`;
    }

    private renderPreview(): JSX.Element {
        const { workoutInstance } = this.props;
        const { preview } = workoutInstance.instance;
        return (
            <Col span={4}>
                <div className='cvat-task-item-preview-wrapper'>
                    {preview && (
                        <img alt='Preview' className='cvat-task-item-preview' src={preview} />
                    )}
                </div>
            </Col>
        );
    }

    private renderDescription(): JSX.Element {
        // Task info
        const { workoutInstance, history } = this.props;
        const { instance } = workoutInstance;
        const owner = instance.owner ? instance.owner.name : null;
        const created = moment(instance.created).format('MMMM Do YYYY');

        const [type, id] = instance.data_url.split('/').slice(-2);

        // Get and truncate a task name
        const name = `${instance.name.substring(0, 70)}${instance.name.length > 70 ? '...' : ''}`;

        return (
            <Col span={10} className='cvat-task-item-description'>
                <Text strong type='secondary' className='cvat-item-task-id'>{`#${instance.id}: `}</Text>
                <Text strong className='cvat-item-task-name'>
                    {name}
                </Text>
                <br />
                {owner && (
                    <>
                        <Text type='secondary'>{`Created ${owner ? `by ${owner}` : ''} on ${created}`}</Text>
                        <br />
                    </>
                )}
                <Text type='secondary'>
                    Used data set:
                    <Button
                        href={`/${type}/${id}`}
                        type='text'
                        onClick={(e: React.MouseEvent): void => {
                            e.preventDefault();
                            history.push(`/${type}/${id}`, { from: 'workouts' });
                        }}
                    >
                        {`${type.slice(0, -1)} #${id}`}
                    </Button>
                </Text>
            </Col>
        );
    }

    private renderProgress(): JSX.Element {
        const { workoutInstance } = this.props;
        const numOfIterations = workoutInstance.instance.iterations;
        const numOfCompleted = (workoutInstance.instance.iteration === 0) ?
            0 : workoutInstance.instance.iteration + 1; // need to add 1
        const timeLeft = (workoutInstance.instance.eta < 0) ? 'N/A' : this.formatSeconds(workoutInstance.instance.eta);
        const { status } = workoutInstance.instance;

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
            <Col span={6}>
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

    private renderNavigation(): JSX.Element {
        const { workoutInstance, history } = this.props;
        const { id } = workoutInstance.instance;

        return (
            <Col span={4}>
                <Row justify='end'>
                    <Col>
                        <Button
                            className='cvat-item-open-task-button'
                            type='primary'
                            size='large'
                            ghost
                            href={`/workouts/${id}`}
                            onClick={(e: React.MouseEvent): void => {
                                e.preventDefault();
                                history.push(`/workouts/${id}`);
                            }}
                        >
                            Open
                        </Button>
                    </Col>
                </Row>
                <Row justify='end'>
                    <Col className='cvat-item-open-task-actions'>
                        <Text className='cvat-text-color'>Actions</Text>
                        <Dropdown overlay={<WorkoutActionsMenuComponent workoutInstance={workoutInstance} />}>
                            <Icon className='cvat-menu-icon' component={MenuIcon} />
                        </Dropdown>
                    </Col>
                </Row>
            </Col>
        );
    }

    public render(): JSX.Element {
        const { workoutInstance } = this.props;
        const { instance } = workoutInstance;
        // const { deleted, hidden } = this.props;
        const style = {};
        // if (deleted) {
        //     (style as any).pointerEvents = 'none';
        //     (style as any).opacity = 0.5;
        // }

        // if (hidden) {
        //     (style as any).display = 'none';
        // }

        return (
            <Row className='cvat-tasks-list-item' justify='center' align='top' style={{ ...style }}>
                {this.renderPreview()}
                {this.renderDescription()}
                <ProgressBarComponent workout={instance} span={6} />
                {this.renderNavigation()}
            </Row>
        );
    }
}

export default withRouter(WorkoutItemComponent);
