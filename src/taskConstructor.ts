import * as gulp from 'gulp';
import { injectable } from 'inversify';
import 'reflect-metadata';
import * as runSequence from 'run-sequence';
import GulpTaskFactory from './gulpTaskFactory';
import Task from './task';

@injectable()
export default class TaskConstructor {
  public constructor(private gulpTaskFactory: GulpTaskFactory) {
  }

  public constructGulpTask<T>(task: Task<T>): string {
    return this.gulpTaskFactory.constructGulpTask(task);
  }

  public constructMultipleGulpTasks<T>(name: string, tasks: Task<T>[], concurrencyLimit?: number): string {
    const generatedTasks: string[] = tasks.map((task: Task<T>) => {
      return this.gulpTaskFactory.constructGulpTask(task);
    });
    return this.constructParallelGulpTask(name, generatedTasks, concurrencyLimit);
  }

  public constructSequentialGulpTask(name: string, taskNames: string[]): string {
    return this.constructParallelGulpTask(name, taskNames, 1);
  }

  public constructParallelGulpTask(name: string, taskNames: string[], concurrencyLimit: number = Number.MAX_SAFE_INTEGER): string {
    const taskNamesSplittedInChunks: string[][] = TaskConstructor.chunk(taskNames, concurrencyLimit);
    gulp.task(name, (callback) => {
      runSequence(...taskNamesSplittedInChunks, callback);
    });
    return name;
  }

  private static chunk<T>(arrayToSplit: T[], chunkSize: number): T[][] {
    let splittedArray: T[][] = [];
    for (let chunkNumber = 0; chunkNumber < arrayToSplit.length; chunkNumber += chunkSize) {
      splittedArray.push(arrayToSplit.slice(chunkNumber * chunkSize, (chunkNumber + 1) * chunkSize));
    }
    return splittedArray;
  }
}