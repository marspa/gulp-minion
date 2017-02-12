import { expect } from 'chai';
import { sandbox, SinonSandbox } from 'sinon';
import iocContainer from '../src/configuration';
import Task from '../src/task';
import TaskFactory from '../src/taskFactory';
import {
  emptyFunctionWithParameter,
  FUNCTION_PARAMETER,
  TASK_WITH_PARAMETER_NAME,
  TASK_NAME,
  emptyFunction
} from './utils';

describe('Factory methods for task creation', function () {
  const UUID_REG_EXP: RegExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{10}/;
  const taskFactory: TaskFactory = iocContainer.get(TaskFactory);

  let sinonSandbox: SinonSandbox;

  beforeEach('initialize spies', function () {
    sinonSandbox = sandbox.create();
  });

  afterEach('reset spies', function () {
    sinonSandbox.restore();
  });

  it('construct a task with a parametrized function', function () {
    testConstructedTask(emptyFunctionWithParameter, FUNCTION_PARAMETER, TASK_WITH_PARAMETER_NAME);
  });

  it('construct a task with a parametrized function and no name', function () {
    testConstructedTask(emptyFunctionWithParameter, FUNCTION_PARAMETER);
  });

  it('construct a task with a void function', function () {
    testConstructedTaskWithoutParameter(emptyFunction, TASK_NAME);
  });

  it('construct a task with a void function and no name', function () {
    testConstructedTaskWithoutParameter(emptyFunction);
  });

  const testConstructedTask = <T>(fn: (parameter: T) => Promise<void>, parameter: T, name?: string): void => {
    const actualTask: Task<T> = taskFactory.getTask(fn, parameter, name);

    checkThatNameWasUsedOrUuidWasGenerated(name, actualTask);
    expect(actualTask.fn).to.equal(fn);
    expect(actualTask.parameter).to.equal(parameter);
  };

  const testConstructedTaskWithoutParameter = (fn: () => Promise<void>, name?: string): void => {
    const actualTask: Task<void> = taskFactory.getTaskWithoutParameter(fn, name);

    checkThatNameWasUsedOrUuidWasGenerated(name, actualTask);
    expect(actualTask.fn).to.equal(fn);
    expect(actualTask.parameter).to.be.an('undefined');
  };

  const checkThatNameWasUsedOrUuidWasGenerated = <T>(name: string, actualTask: Task<T>) => {
    if (name) {
      expect(actualTask.id).to.equal(name);
    }
    else {
      expect(actualTask.id).to.match(UUID_REG_EXP);
    }
  };
});