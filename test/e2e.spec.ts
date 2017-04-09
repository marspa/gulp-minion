import { expect } from 'chai';
import { GulpMinion, iocContainer, Task, TaskFactory, TaskRunner } from '../index';
import { range, TASK_NAME } from './utils';

describe('Execute tasks', function () {
  const NUMBER_OF_TASKS: number = 5;

  let actualTasks: string[];

  const taskFactory: TaskFactory = iocContainer.get(TaskFactory);
  const taskRunner: TaskRunner = iocContainer.get(TaskRunner);
  const gulpMinion: GulpMinion = iocContainer.get(GulpMinion);

  const executeTaskMessage = (index: number): string => {
    return prefixMessage('executing synchronous task #' + index, index);
  };

  const startTaskMessage = (index: number): string => {
    return prefixMessage('starting asynchronous task #' + index, index);
  };

  const stopTaskMessage = (index: number): string => {
    return prefixMessage('stopping asynchronous task #' + index, index);
  };

  const prefixMessage = (message: string, index: number): string => {
    let prefix: string = '';
    range(index).forEach(() => {
      prefix += '  ';
    });
    return prefix + message;
  };

  const storeTaskNumber = (index: number): Promise<void> => {
    actualTasks.push(executeTaskMessage(index));
    return Promise.resolve();
  };

  const TASKS: Task<number>[] = range(NUMBER_OF_TASKS).map(index => {
    return taskFactory.getTask(storeTaskNumber, index);
  });

  const sleep = (milliseconds: number): Promise<any> => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  const storeTaskNumberAsync = async(index: number): Promise<void> => {
    actualTasks.push(startTaskMessage(index));
    const delayInMilliseconds: number = 5;
    await sleep((NUMBER_OF_TASKS - index) * delayInMilliseconds);
    actualTasks.push(stopTaskMessage(index));
    return Promise.resolve();
  };

  const TASKS_ASYNC: Task<number>[] = range(NUMBER_OF_TASKS).map(index => {
    return taskFactory.getTask(storeTaskNumberAsync, index);
  });

  beforeEach('reset ran task sequence', function () {
    actualTasks = [];
  });

  it('runs a single task', function (done) {
    const expectedTasks: string[] = [executeTaskMessage(0)];

    const taskToExecute: string = gulpMinion.constructGulpTask(TASKS[0]);

    taskRunner.execute(taskToExecute).then(() => {
      expect(actualTasks).to.deep.equal(expectedTasks);
      done();
    });
  });

  it('runs multiple tasks', function (done) {
    const expectedTasks: string[] = range(NUMBER_OF_TASKS).map((index: number) => {
      return executeTaskMessage(index);
    });

    const taskToExecute: string = gulpMinion.constructParallelGulpTasks(TASK_NAME, TASKS);

    taskRunner.execute(taskToExecute).then(() => {
      expect(actualTasks).to.deep.equal(expectedTasks);
      done();
    });
  });

  it('runs multiple tasks in parallel', function (done) {
    let expectedTasks: string[] = range(NUMBER_OF_TASKS).map((index: number) => {
      return startTaskMessage(index);
    });
    range(NUMBER_OF_TASKS).reverse().forEach((index: number) => {
      expectedTasks.push(stopTaskMessage(index));
    });

    const taskToExecute: string = gulpMinion.constructParallelGulpTasks(TASK_NAME, TASKS_ASYNC);

    taskRunner.execute(taskToExecute).then(() => {
      expect(actualTasks).to.deep.equal(expectedTasks);
      done();
    });
  });

  it('runs multiple tasks sequentially', function (done) {
    let expectedTasks: string[] = [];
    range(NUMBER_OF_TASKS).forEach((index: number) => {
      expectedTasks.push(startTaskMessage(index));
      expectedTasks.push(stopTaskMessage(index));
    });
    const taskNames: string[] = TASKS_ASYNC.map((task: Task<number>) => {
      return task.id;
    });
    gulpMinion.constructParallelGulpTasks(TASK_NAME, TASKS_ASYNC);

    const taskToExecute: string = gulpMinion.constructSequentialGulpTask('sequential-' + TASK_NAME, taskNames);

    taskRunner.execute(taskToExecute).then(() => {
      expect(actualTasks).to.deep.equal(expectedTasks);
      done();
    });
  });
});