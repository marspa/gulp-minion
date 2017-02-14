import * as gulp from 'gulp';
import { injectable } from 'inversify';
import 'reflect-metadata';
import Task from './task';

@injectable()
export default class GulpTaskFactory {
  public constructGulpTask<T>(task: Task<T>): string {
    const constructedTaskName: string = task.id;
    gulp.task(constructedTaskName, async () => {
      await task.fn(task.parameter);
    });
    return constructedTaskName;
  }
}