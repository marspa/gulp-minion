import Task from './task';

declare class GulpTaskFactory {
  constructGulpTask<T>(task: Task<T>): string;
}

export default GulpTaskFactory;