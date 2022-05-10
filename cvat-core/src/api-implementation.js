// Copyright (C) 2019-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

(() => {
    const PluginRegistry = require('./plugins');
    const serverProxy = require('./server-proxy');
    const aifredProxy = require('./aifred-proxy');
    const lambdaManager = require('./lambda-manager');
    const {
        isBoolean,
        isInteger,
        isEnum,
        isString,
        checkFilter,
        checkExclusiveFields,
        camelToSnake,
    } = require('./common');

    const {
        TaskStatus,
        TaskMode,
        DimensionType,
        CloudStorageProviderType,
        CloudStorageCredentialsType,
        WorkoutStatus,
    } = require('./enums');

    const User = require('./user');
    const { AnnotationFormats } = require('./annotation-formats');
    const { ArgumentError } = require('./exceptions');
    const { Task } = require('./session');
    const { Project } = require('./project');
    const { CloudStorage } = require('./cloud-storage');

    function implementAPI(cvat) {
        cvat.plugins.list.implementation = PluginRegistry.list;
        cvat.plugins.register.implementation = PluginRegistry.register.bind(cvat);

        cvat.lambda.list.implementation = lambdaManager.list.bind(lambdaManager);
        cvat.lambda.run.implementation = lambdaManager.run.bind(lambdaManager);
        cvat.lambda.call.implementation = lambdaManager.call.bind(lambdaManager);
        cvat.lambda.cancel.implementation = lambdaManager.cancel.bind(lambdaManager);
        cvat.lambda.listen.implementation = lambdaManager.listen.bind(lambdaManager);
        cvat.lambda.requests.implementation = lambdaManager.requests.bind(lambdaManager);

        cvat.server.about.implementation = async () => {
            const result = await serverProxy.server.about();
            return result;
        };

        cvat.server.share.implementation = async (directory) => {
            const result = await serverProxy.server.share(directory);
            return result;
        };

        cvat.server.formats.implementation = async () => {
            const result = await serverProxy.server.formats();
            return new AnnotationFormats(result);
        };

        cvat.server.userAgreements.implementation = async () => {
            const result = await serverProxy.server.userAgreements();
            return result;
        };

        cvat.server.register.implementation = async (
            username,
            firstName,
            lastName,
            email,
            password1,
            password2,
            userConfirmations,
        ) => {
            const user = await serverProxy.server.register(
                username,
                firstName,
                lastName,
                email,
                password1,
                password2,
                userConfirmations,
            );

            return new User(user);
        };

        cvat.server.login.implementation = async (username, password) => {
            await serverProxy.server.login(username, password);
        };

        cvat.server.signing.implementation = async (url) => {
            const result = await serverProxy.server.signing(url);
            return result;
        };

        cvat.server.logout.implementation = async () => {
            await serverProxy.server.logout();
        };

        cvat.server.changePassword.implementation = async (oldPassword, newPassword1, newPassword2) => {
            await serverProxy.server.changePassword(oldPassword, newPassword1, newPassword2);
        };

        cvat.server.requestPasswordReset.implementation = async (email) => {
            await serverProxy.server.requestPasswordReset(email);
        };

        cvat.server.resetPassword.implementation = async (newPassword1, newPassword2, uid, token) => {
            await serverProxy.server.resetPassword(newPassword1, newPassword2, uid, token);
        };

        cvat.server.authorized.implementation = async () => {
            const result = await serverProxy.server.authorized();
            return result;
        };

        cvat.server.request.implementation = async (url, data) => {
            const result = await serverProxy.server.request(url, data);
            return result;
        };

        cvat.server.installedApps.implementation = async () => {
            const result = await serverProxy.server.installedApps();
            return result;
        };

        cvat.users.get.implementation = async (filter) => {
            checkFilter(filter, {
                id: isInteger,
                is_active: isBoolean,
                self: isBoolean,
                search: isString,
                limit: isInteger,
            });

            let users = null;
            if ('self' in filter && filter.self) {
                users = await serverProxy.users.self();
                users = [users];
            } else {
                const searchParams = {};
                for (const key in filter) {
                    if (filter[key] && key !== 'self') {
                        searchParams[key] = filter[key];
                    }
                }
                users = await serverProxy.users.get(new URLSearchParams(searchParams).toString());
            }

            users = users.map((user) => new User(user));
            return users;
        };

        cvat.jobs.get.implementation = async (filter) => {
            checkFilter(filter, {
                taskID: isInteger,
                jobID: isInteger,
            });

            if ('taskID' in filter && 'jobID' in filter) {
                throw new ArgumentError('Only one of fields "taskID" and "jobID" allowed simultaneously');
            }

            if (!Object.keys(filter).length) {
                throw new ArgumentError('Job filter must not be empty');
            }

            let tasks = [];
            if ('taskID' in filter) {
                tasks = await serverProxy.tasks.getTasks(`id=${filter.taskID}`);
            } else {
                const job = await serverProxy.jobs.get(filter.jobID);
                if (typeof job.task_id !== 'undefined') {
                    tasks = await serverProxy.tasks.getTasks(`id=${job.task_id}`);
                }
            }

            // If task was found by its id, then create task instance and get Job instance from it
            if (tasks.length) {
                const task = new Task(tasks[0]);
                return filter.jobID ? task.jobs.filter((job) => job.id === filter.jobID) : task.jobs;
            }

            return tasks;
        };

        cvat.tasks.get.implementation = async (filter) => {
            checkFilter(filter, {
                page: isInteger,
                projectId: isInteger,
                name: isString,
                id: isInteger,
                owner: isString,
                assignee: isString,
                search: isString,
                status: isEnum.bind(TaskStatus),
                mode: isEnum.bind(TaskMode),
                dimension: isEnum.bind(DimensionType),
            });

            checkExclusiveFields(filter, ['id', 'search', 'projectId'], ['page']);

            const searchParams = new URLSearchParams();
            for (const field of [
                'name',
                'owner',
                'assignee',
                'search',
                'status',
                'mode',
                'id',
                'page',
                'projectId',
                'dimension',
            ]) {
                if (Object.prototype.hasOwnProperty.call(filter, field)) {
                    searchParams.set(field, filter[field]);
                }
            }

            const tasksData = await serverProxy.tasks.getTasks(searchParams.toString());
            const tasks = tasksData.map((task) => new Task(task));

            tasks.count = tasksData.count;

            return tasks;
        };

        cvat.projects.get.implementation = async (filter) => {
            checkFilter(filter, {
                id: isInteger,
                page: isInteger,
                name: isString,
                assignee: isString,
                owner: isString,
                search: isString,
                status: isEnum.bind(TaskStatus),
                withoutTasks: isBoolean,
            });

            checkExclusiveFields(filter, ['id', 'search'], ['page', 'withoutTasks']);

            if (typeof filter.withoutTasks === 'undefined') {
                if (typeof filter.id === 'undefined') {
                    filter.withoutTasks = true;
                } else {
                    filter.withoutTasks = false;
                }
            }

            const searchParams = new URLSearchParams();
            for (const field of ['name', 'assignee', 'owner', 'search', 'status', 'id', 'page', 'withoutTasks']) {
                if (Object.prototype.hasOwnProperty.call(filter, field)) {
                    searchParams.set(camelToSnake(field), filter[field]);
                }
            }

            const projectsData = await serverProxy.projects.get(searchParams.toString());
            // prettier-ignore
            const projects = projectsData.map((project) => {
                if (filter.withoutTasks) {
                    project.task_ids = project.tasks;
                    project.tasks = [];
                } else {
                    project.task_ids = project.tasks.map((task) => task.id);
                }
                return project;
            }).map((project) => new Project(project));

            projects.count = projectsData.count;

            return projects;
        };

        cvat.projects.searchNames
            .implementation = async (search, limit) => serverProxy.projects.searchNames(search, limit);

        cvat.cloudStorages.get.implementation = async (filter) => {
            checkFilter(filter, {
                page: isInteger,
                displayName: isString,
                resourceName: isString,
                description: isString,
                id: isInteger,
                owner: isString,
                search: isString,
                providerType: isEnum.bind(CloudStorageProviderType),
                credentialsType: isEnum.bind(CloudStorageCredentialsType),
            });

            checkExclusiveFields(filter, ['id', 'search'], ['page']);

            const searchParams = new URLSearchParams();
            for (const field of [
                'displayName',
                'credentialsType',
                'providerType',
                'owner',
                'search',
                'id',
                'page',
                'description',
            ]) {
                if (Object.prototype.hasOwnProperty.call(filter, field)) {
                    searchParams.set(camelToSnake(field), filter[field]);
                }
            }

            if (Object.prototype.hasOwnProperty.call(filter, 'resourceName')) {
                searchParams.set('resource', filter.resourceName);
            }

            const cloudStoragesData = await serverProxy.cloudStorages.get(searchParams.toString());
            const cloudStorages = cloudStoragesData.map((cloudStorage) => new CloudStorage(cloudStorage));

            cloudStorages.count = cloudStoragesData.count;

            return cloudStorages;
        };

        cvat.aifred.login.implementation = (url) => aifredProxy.login(url);

        cvat.aifred.workspaces.implementation = () => aifredProxy.workspaces();

        cvat.aifred.dtls.implementation = (workspaceId) => aifredProxy.dtls(workspaceId);

        cvat.aifred.createWorkout
            .implementation = (name, instance, workspaceId, dtlId, iterations) => {
                aifredProxy.createWorkout(name, instance, workspaceId, dtlId, iterations);
            };

        cvat.aifred.getSelf.implementation = () => aifredProxy.getSelf();

        cvat.aifred.authorized.implementation = () => aifredProxy.authorized();

        const getWorkoutPreview = async (workout) => {
            const url = new URL(workout.data_url);
            const [type, id] = url.pathname.split('/').slice(-2);

            const result = {
                dataset: null,
                preview: null,
            };

            switch (type) {
                case 'tasks': {
                    const tasks = await cvat.tasks.get.implementation({ id: Number(id) });
                    const task = tasks.pop();
                    result.dataset = task;
                    result.preview = await task.frames.preview();
                    break;
                }
                case 'projects': {
                    const projects = await cvat.projects.get.implementation({ id: Number(id) });
                    const project = projects.pop();
                    result.dataset = project;
                    result.preview = await project.preview();
                    break;
                }
                default:
                    break;
            }

            return result;
        };

        cvat.aifred.getWorkouts.implementation = async (filter) => {
            checkFilter(filter, {
                id: isInteger,
                page: isInteger,
                task: isInteger,
                project: isInteger,
                search: isString,
                status: isEnum.bind(WorkoutStatus),
            });

            checkExclusiveFields(filter, ['id', 'search'], ['page']);

            const searchParams = new URLSearchParams();
            for (const field of ['search', 'status', 'id', 'page', 'task', 'project']) {
                if (Object.prototype.hasOwnProperty.call(filter, field)) {
                    searchParams.set(camelToSnake(field), filter[field]);
                }
            }

            const workoutsData = await aifredProxy.getWorkouts(searchParams.toString());
            const workouts = workoutsData.map(async (workout) => {
                const { dataset, preview } = await getWorkoutPreview(workout);

                workout.dataset = dataset;
                workout.preview = preview;
                workout.owner = workout.cvat_user;

                return workout;
            });

            const result = await Promise.all(workouts);
            return result;
        };

        cvat.aifred.getWorkout.implementation = async (workoutId) => {
            const workout = await aifredProxy.getWorkout(workoutId);
            const preview = await getWorkoutPreview(workout);
            return {
                ...workout,
                ...preview,
                owner: workout.cvat_user,
            };
        };

        cvat.aifred.getWorkoutImage.implementation = (workoutId, fileType, fileName) => {
            aifredProxy.getWorkoutImage(workoutId, fileType, fileName);
        };

        cvat.aifred.getWorkoutMetrics.implementation = (workoutId) => aifredProxy.getWorkoutMetrics(workoutId);

        cvat.aifred.getOcellusModel.implementation = (workoutId, fileName) => {
            aifredProxy.getOcellusModel(workoutId, fileName);
        };

        cvat.aifred.stopTraining.implementation = (workoutId) => aifredProxy.stopTraining(workoutId);

        cvat.aifred.deleteWorkout.implementation = (workoutId) => aifredProxy.deleteWorkout(workoutId);

        cvat.aifred.updateWorkout.implementation = (workoutId, name, instance, dtlId, iterations) => {
            aifredProxy.updateWorkout(workoutId, name, instance, dtlId, iterations);
        };

        return cvat;
    }

    module.exports = implementAPI;
})();
