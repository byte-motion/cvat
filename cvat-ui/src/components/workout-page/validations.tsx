// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useEffect } from 'react';
import Title from 'antd/lib/typography/Title';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/lib/spin';

import Text from 'antd/lib/typography/Text';
import { getWorkoutValidationsAsync } from 'actions/workout-actions';
import { CombinedState, WorkoutValidation } from 'reducers/interfaces';
import EmptyListComponent from './empty-list';

interface ValidationsComponentProps {
    workout: any;
}

export default function ValidationsComponent(props: ValidationsComponentProps): JSX.Element {
    const { workout } = props;

    const dispatch = useDispatch();

    const images = useSelector((state: CombinedState) => state.workout.activities.validations.images);
    const imagesFetching = useSelector((state: CombinedState) => state.workout.activities.validations.fetching);

    useEffect(() => {
        dispatch(
            getWorkoutValidationsAsync(workout),
        );
    }, [workout, dispatch]);

    const imagesCount = images.length;

    return (
        <div className='cvat-workout-details'>
            <Title level={4} className='cvat-text-color cvat-workout-name'>
                Model Validations
            </Title>
            {imagesFetching ? <Spin key={workout.id} size='large' className='cvat-spinner' /> : images.map(
                (item: WorkoutValidation, idx: number): JSX.Element => (
                    <div key={item.name} className='cvat-workout-image-container'>
                        <Text strong>{`#${idx + 1}:`}</Text>
                        <img key={item.name} alt={item.name} className='cvat-workout-validation-preview' src={item.image} />
                    </div>
                ),
            )}
            {!(imagesFetching || imagesCount) && <EmptyListComponent message='No model validations yet...' />}
        </div>
    );
}
