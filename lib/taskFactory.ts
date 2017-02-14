import { injectable } from 'inversify';
import 'reflect-metadata';
import * as uuid from 'uuid';
import Task from './task';

@injectable()
export default class TaskFactory {
  public getTask<T>(fn: (parameter: T) => Promise<void>, parameter: T, name: string = uuid()): Task<T> {
    return new Task<T>(name, fn, parameter);
  };

  public getTaskWithoutParameter(fn: () => Promise<void>, name: string = uuid()): Task<void> {
    return this.getTask(fn, undefined, name);
  };
}