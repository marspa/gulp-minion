import DynamicGulpfileBuilder from './dynamicGulpfileBuilder';
import GulpTaskFactory from './gulpTaskFactory';
import TaskFactory from './taskFactory';
import TaskRunner from './taskRunner';

declare namespace iocContainer {
  function get(dynamicGulpfileBuilder: DynamicGulpfileBuilder): DynamicGulpfileBuilder;
  function get(gulpTaskFactory: GulpTaskFactory): GulpTaskFactory;
  function get(taskFactory: TaskFactory): TaskFactory;
  function get(taskRunner: TaskRunner): TaskRunner;
}

export default iocContainer;