import { Container } from 'inversify';
import GulpMinion from './gulpMinion';
import GulpTaskFactory from './gulpTaskFactory';
import TaskFactory from './taskFactory';
import TaskRunner from './taskRunner';

const iocContainer: Container = new Container();
iocContainer.bind(GulpMinion).toSelf().inSingletonScope();
iocContainer.bind(GulpTaskFactory).toSelf().inSingletonScope();
iocContainer.bind(TaskFactory).toSelf().inSingletonScope();
iocContainer.bind(TaskRunner).toSelf().inSingletonScope();

export default iocContainer;