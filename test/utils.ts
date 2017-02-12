import iocContainer from '../src/configuration';
import Task from '../src/task';
import TaskFactory from '../src/taskFactory';

const taskFactory: TaskFactory = iocContainer.get(TaskFactory);

export const range = (maxExcluded: number): number[] =>  {
  return [...Array(maxExcluded).keys()];
};

export const NUMBER_OF_TASKS: number = 8;

export const emptyFunction: () => Promise<void> = (): Promise<void> => {
  return Promise.resolve();
};

export const TASK_NAME: string = 'task';

export const TASKS: Task<void>[] = range(NUMBER_OF_TASKS).map(index => {
  return taskFactory.getTaskWithoutParameter(emptyFunction, TASK_NAME + '_' + index);
});

export const emptyFunctionWithParameter = (parameter: string): Promise<void> => {
  if (parameter) {
    return Promise.reject('You need to call this function with a parameter!');
  }
  else {
    return Promise.resolve();
  }
};

export const FUNCTION_PARAMETER: string = 'some parameter';

export const TASK_WITH_PARAMETER_NAME: string = 'task-with-parameter';

export const TASKS_WITH_PARAMETER: Task<string>[] = range(NUMBER_OF_TASKS).map((index: number) => {
  return taskFactory.getTask(emptyFunctionWithParameter, FUNCTION_PARAMETER + ': ' + index, TASK_WITH_PARAMETER_NAME + '_');
});