import Task from './task';

declare class DynamicGulpfileBuilder {
  constructGulpTask<T>(task: Task<T>): string;

  constructMultipleGulpTasks<T>(name: string, tasks: Task<T>[], concurrencyLimit?: number): string;

  constructSequentialGulpTask(name: string, taskNames: string[]): string;

  constructParallelGulpTask(name: string, taskNames: string[], concurrencyLimit?: number): string;

  private static chunk<T>(arrayToSplit: T[], chunkSize: number): T[][];
}

export default DynamicGulpfileBuilder;