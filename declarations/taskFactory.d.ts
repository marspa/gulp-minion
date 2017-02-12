import Task from './task';

declare class TaskFactory {
  getTask<T>(fn: (parameter: T) => Promise<void>, parameter: T, name?: string): Task<T>;

  getTaskWithoutParameter(fn: () => Promise<void>, name: string): Task<void>;
}

export default TaskFactory;