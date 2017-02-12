import { Container } from 'inversify';
import TaskConstructor from './taskConstructor';
import GulpTaskFactory from './gulpTaskFactory';
import TaskFactory from './taskFactory';
import TaskRunner from './taskRunner';

const iocContainer: Container = new Container();
iocContainer.bind<TaskConstructor>(TaskConstructor).toSelf().inSingletonScope();
iocContainer.bind<GulpTaskFactory>(GulpTaskFactory).toSelf().inSingletonScope();
iocContainer.bind<TaskFactory>(TaskFactory).toSelf().inSingletonScope();
iocContainer.bind<TaskRunner>(TaskRunner).toSelf().inSingletonScope();

export default iocContainer;