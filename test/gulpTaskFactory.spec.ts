import { expect } from 'chai';
import * as gulp from 'gulp';
import { sandbox, SinonSandbox, SinonSpy } from 'sinon';
import iocContainer from '../lib/configuration';
import Task from '../lib/task';
import GulpTaskFactory from '../lib/gulpTaskFactory';
import { TASKS, TASKS_WITH_PARAMETER } from './utils';

describe('Construct a gulp task', function () {

  const gulpTaskFactory: GulpTaskFactory = iocContainer.get(GulpTaskFactory);

  let sinonSandbox: SinonSandbox;
  let gulpTaskSpy: SinonSpy;

  beforeEach('initialize spies', function () {
    sinonSandbox = sandbox.create();
    gulpTaskSpy = sinonSandbox.spy(gulp, 'task');
  });

  afterEach('reset spies', function () {
    sinonSandbox.restore();
  });

  const tests = [
    { task: TASKS[0], message: 'constructs a task without parameters' },
    { task: TASKS_WITH_PARAMETER[0], message: 'constructs a task with a parameter' }
  ];
  tests.forEach(test => {
    const task: Task<any> = test.task;

    it(test.message, function () {
      const actualTaskName: string = gulpTaskFactory.constructGulpTask(task);

      expect(actualTaskName).to.equal(task.id);
      expect(gulpTaskSpy.calledWith(task.id)).to.equal(true);
    });
  });

});