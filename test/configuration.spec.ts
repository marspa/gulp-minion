import { expect } from 'chai';
import iocContainer from '../lib/configuration';
import GulpMinion from '../lib/gulpMinion';
import GulpTaskFactory from '../lib/gulpTaskFactory';
import TaskFactory from '../lib/taskFactory';
import TaskRunner from '../lib/taskRunner';

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
    const gulpMinion: GulpMinion = iocContainer.get(GulpMinion);

    expect(gulpMinion).not.to.equal(null);
    expect(gulpMinion).to.be.an.instanceof(GulpMinion);
  });
});