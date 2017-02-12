import { injectable } from 'inversify';
import 'reflect-metadata';
import * as runSequence from 'run-sequence';

@injectable()
export default class TaskRunner {
  public execute(task: string): Promise<void> {
    return new Promise<void>((resolve) => {
      runSequence(task, () => {
        resolve();
      });
    });
  }
}