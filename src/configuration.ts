import { Container } from 'inversify';
import DynamicGulpfileBuilder from './dynamicGulpfileBuilder';
import GulpTaskFactory from './gulpTaskFactory';
import TaskFactory from './taskFactory';
import TaskRunner from './taskRunner';

const iocContainer: Container = new Container();
iocContainer.bind<DynamicGulpfileBuilder>(DynamicGulpfileBuilder).toSelf().inSingletonScope();
iocContainer.bind<GulpTaskFactory>(GulpTaskFactory).toSelf().inSingletonScope();
iocContainer.bind<TaskFactory>(TaskFactory).toSelf().inSingletonScope();
iocContainer.bind<TaskRunner>(TaskRunner).toSelf().inSingletonScope();

export default iocContainer;