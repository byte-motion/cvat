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

import { Workout } from 'reducers/interfaces';
import WorkoutActionsMenuComponent from './actions-menu';

interface Props {
    workoutInstance: Workout;
}

class WorkoutItemComponent extends React.PureComponent<Props & RouteComponentProps> {
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
                            history.push(`/${type}/${id}`);
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
        // Count number of jobs and performed jobs
        const numOfIterations = workoutInstance.instance.iterations;
        const numOfCompleted = (workoutInstance.instance.status === 'completed') ? numOfIterations : 0;

        // Progress appearance depends on number of jobs
        let progressColor = null;
        let progressText = null;
        if (numOfCompleted && numOfCompleted === numOfIterations) {
            progressColor = 'cvat-task-completed-progress';
            progressText = (
                <Text strong className={progressColor}>
                    Completed
                </Text>
            );
        } else if (numOfCompleted) {
            progressColor = 'cvat-task-progress-progress';
            progressText = (
                <Text strong className={progressColor}>
                    In Progress
                </Text>
            );
        } else {
            progressColor = 'cvat-task-pending-progress';
            progressText = (
                <Text strong className={progressColor}>
                    Pending
                </Text>
            );
        }

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
                            className={`${progressColor} cvat-task-progress`}
                            percent={workoutProgress * 100}
                            strokeColor='#1890FF'
                            showInfo={false}
                            strokeWidth={5}
                            size='small'
                        />
                    </Col>
                </Row>
                {/* <AutomaticAnnotationProgress
                    activeInference={activeInference}
                    cancelAutoAnnotation={cancelAutoAnnotation}
                /> */}
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
                {this.renderProgress()}
                {this.renderNavigation()}
            </Row>
        );
    }
}

export default withRouter(WorkoutItemComponent);
