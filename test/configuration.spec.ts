import { expect } from 'chai';
import iocContainer from '../src/configuration';
import GulpTaskFactory from '../src/gulpTaskFactory';
import TaskConstructor from '../src/taskConstructor';
import TaskFactory from '../src/taskFactory';
import TaskRunner from '../src/taskRunner';

describe('Setup IoC container', function () {
  it('contains all objects without dependencies', function () {
    const gulpTaskFactory: GulpTaskFactory = iocContainer.get(GulpTaskFactory);
    expect(gulpTaskFactory).not.to.equal(null);
    expect(gulpTaskFactory).to.be.an.instanceof(GulpTaskFactory);

    const taskFactory: TaskFactory = iocContainer.get(TaskFactory);
    expect(taskFactory).not.to.equal(null);
    expect(taskFactory).to.be.an.instanceof(TaskFactory);

    const taskRunner: TaskRunner = iocContainer.get(TaskRunner);
    expect(taskRunner).not.to.equal(null);
    expect(taskRunner).to.be.an.instanceof(TaskRunner);
  });

  it('contains all objects with dependencies', function () {
    const taskConstructor: TaskConstructor = iocContainer.get(TaskConstructor);

    expect(taskConstructor).not.to.equal(null);
    expect(taskConstructor).to.be.an.instanceof(TaskConstructor);
  });
});