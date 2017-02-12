import { expect } from 'chai';
import * as gulp from 'gulp';
import { sandbox, SinonSandbox, SinonSpy } from 'sinon';
import iocContainer from '../src/configuration';
import DynamicGulpfileBuilder from '../src/dynamicGulpfileBuilder';
import GulpTaskFactory from '../src/gulpTaskFactory';
import Task from '../src/task';
import { TASKS, TASK_NAME } from './utils';

describe('Construct tasks', function () {
  const gulpTaskFactory: GulpTaskFactory = iocContainer.get<GulpTaskFactory>(GulpTaskFactory);
  const dynamicGulpfileBuilder: DynamicGulpfileBuilder = iocContainer.get<DynamicGulpfileBuilder>(DynamicGulpfileBuilder);

  let sinonSandbox: SinonSandbox;
  let gulpTaskFactoryConstructTaskSpy: SinonSpy;
  let gulpTaskSpy: SinonSpy;

  beforeEach('initialize spies', function () {
    sinonSandbox = sandbox.create();
    gulpTaskFactoryConstructTaskSpy = sinonSandbox.spy(gulpTaskFactory, 'constructGulpTask');
    gulpTaskSpy = sinonSandbox.spy(gulp, 'task');
  });

  afterEach('reset spies', function () {
    sinonSandbox.restore();
  });

  it('delegates construction to the GulpTaskFactory', function () {
    const actualTaskName: string = dynamicGulpfileBuilder.constructGulpTask(TASKS[0]);

    expect(actualTaskName).to.equal(TASKS[0].id);
    expect(gulpTaskFactoryConstructTaskSpy.calledWithMatch(TASKS[0])).to.equal(true);
  });

  it('constructs individual single tasks from a given array', function () {
    const actualTaskName: string = dynamicGulpfileBuilder.constructMultipleGulpTasks(TASK_NAME, TASKS);

    expect(actualTaskName).to.equal(TASK_NAME);
    TASKS.forEach((task: Task<void>) => {
      expect(gulpTaskFactoryConstructTaskSpy.calledWithExactly(task)).to.equal(true);
    });
    expect(gulpTaskSpy.calledWithMatch(TASK_NAME)).to.equal(true);
  });

  it('constructs multiple parallel tasks in given chunks', function () {
    const concurrencyLimit: number = 3;
    const actualTaskName: string = dynamicGulpfileBuilder.constructMultipleGulpTasks(TASK_NAME, TASKS, concurrencyLimit);

    expect(actualTaskName).to.equal(TASK_NAME);
    TASKS.forEach((task: Task<void>) => {
      expect(gulpTaskFactoryConstructTaskSpy.calledWithExactly(task)).to.equal(true);
    });
    expect(gulpTaskSpy.calledWithMatch(TASK_NAME)).to.equal(true);
  });

  it('constructs sequential tasks in a given ordering', function () {
    const taskNames: string[] = TASKS.map((task: Task<void>) => {
      return task.id;
    });
    dynamicGulpfileBuilder.constructMultipleGulpTasks('unused-' + TASK_NAME, TASKS);

    const actualTaskName: string = dynamicGulpfileBuilder.constructSequentialGulpTask(TASK_NAME, taskNames);

    expect(actualTaskName).to.equal(TASK_NAME);
    TASKS.forEach((task: Task<void>) => {
      expect(gulpTaskFactoryConstructTaskSpy.calledWithExactly(task)).to.equal(true);
    });
    expect(gulpTaskSpy.calledWithMatch(TASK_NAME)).to.equal(true);
  });
});