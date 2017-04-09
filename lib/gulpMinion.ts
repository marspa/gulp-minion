import * as gulp from 'gulp';
import { injectable } from 'inversify';
import 'reflect-metadata';
import * as runSequence from 'run-sequence';
import GulpTaskFactory from './gulpTaskFactory';
import Task from './task';

@injectable()
export default class GulpMinion {
  public constructor(private gulpTaskFactory: GulpTaskFactory) {
  }

  public constructGulpTask<T>(task: Task<T>): string {
    return this.gulpTaskFactory.constructGulpTask(task);
  }

  public constructParallelGulpTasks<T>(name: string, tasks: Task<T>[], concurrencyLimit: number = Number.MAX_SAFE_INTEGER): string {
    const generatedTasks: string[] = tasks.map((task: Task<T>) => {
      return this.gulpTaskFactory.constructGulpTask(task);
    });
    return this.constructMultipleGulpTasks(name, generatedTasks, concurrencyLimit);
  }

  public constructSequentialGulpTask(name: string, taskNames: string[]): string {
    return this.constructMultipleGulpTasks(name, taskNames, 1);
  }

  private constructMultipleGulpTasks(name: string, taskNames: string[], concurrencyLimit: number): string {
    const taskNamesSplittedInChunks: string[][] = GulpMinion.chunk(taskNames, concurrencyLimit);
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