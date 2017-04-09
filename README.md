[![travis_ci](https://img.shields.io/travis/marspa/gulp-minion.svg)]()
[![coveralls](https://img.shields.io/coveralls/marspa/gulp-minion.svg)]()
[![npm](https://img.shields.io/npm/v/gulp-minion.svg)]()
[![npm](https://img.shields.io/npm/l/gulp-minion.svg)]()

# gulp-minion

## What is gulp-minion?

gulp-minion is a tool that allows you to easily construct and orchestrate gulp.js tasks.
In particular, gulp-minion allows you to
* generate a single gulp.js task from an ordinary function, cf.&thinsp;[TaskFactory.getTask](#get-tasks-without-params) and [TaskFactory.getTaskWithoutParameter](#get-tasks-with-params),
* generate a gulp.js task that executes an arbitrary number of gulp.js tasks in parallel, cf.&thinsp;[GulpMinion.constructParallelGulpTasks](#parallel-tasks),
* generate a gulp.js task that executes an arbitrary number of gulp.js tasks one after another cf.&thinsp;[GulpMinion.constructSequentialGulpTask](#sequential-tasks),
* execute a gulp.js task, cf.&thinsp;[TaskRunner.execute](#execute-tasks),
* and can be set up easily using the provided IoC container, cf. [Configuration](ioc-container).


## Sample Usage

```typescript
import { exec } from 'child_process';
import { GulpMinion, iocContainer, Task, TaskFactory, TaskRunner } from 'gulp-minion';

// retrieve the objects from IoC container
const gulpMinion: GulpMinion = iocContainer.get(GulpMinion);
const taskFactory: TaskFactory = iocContainer.get(TaskFactory);
const taskRunner: TaskRunner = iocContainer.get(TaskRunner);

// define the interface and instances of Git repositories
interface GitRepository {
  url: string;
  branch: string;
}

const gitRepositories: GitRepository[] = [
  {
    "url": "https://github.com/gulpjs/gulp.git",
    "branch": "master"
  },
  {
    "url": "https://github.com/kelektiv/node-uuid.git",
    "branch": "master"
  },
  {
    "url": "https://github.com/isaacs/rimraf.git",
    "branch": "master"
  }
];

// define the single Git tasks as plain functions
const clone = (gitRepository: GitRepository): Promise<void> => {
  exec('git clone ' + gitRepository.url);
  return Promise.resolve();
};

const checkout = (gitRepository: GitRepository): Promise<void> => {
  exec('git checkout ' + gitRepository.branch);
  return Promise.resolve();
};

// create Task objects from the Git repository instances
const cloneTasks: Task<GitRepository>[] = gitRepositories.map((gitRepository: GitRepository) => {
  return taskFactory.getTask(clone, gitRepository);
});

const checkoutTasks: Task<GitRepository>[] = gitRepositories.map((gitRepository: GitRepository) => {
  return taskFactory.getTask(checkout, gitRepository);
});

// create Gulp tasks from the Task objects
const cloneGulpTask: string = gulpMinion.constructParallelGulpTasks('clone', cloneTasks);
const checkoutGulpTask: string = gulpMinion.constructParallelGulpTasks('checkout', checkoutTasks);

// orchestrate several tasks
const updateGulpTask: string = gulpMinion.constructSequentialGulpTask('update', [cloneGulpTask, checkoutGulpTask]);

// execute the update Task
taskRunner.execute(updateGulpTask);
```



## Documentation

The gulp-minion package consists of the following classes:


### Task<T>

A generic DTO that describes a task. A task has the following properties:
* A unique ```id```.
* A function ```fn``` that has an optional input ```parameter``` and returns a ```Promise<void>``` object.
* An optional ```parameter``` for the function ```fn```.
To generate a ```Task``` object, you can use the ```TaskFactory```.


### TaskFactory

A factory class to produce ```Task``` objects.

#### <a id="get-tasks-with-params"></a>getTask<T>(fn: (parameter: T) => Promise<void>, parameter: T, name: string = uuid()): Task<T>;

Generate a ```Task``` object by passing a function with precisely one input parameter and the corresponding input parameter.
If no ```id``` is passed, an random UUID is generated.

#### <a id="get-tasks-without-params"></a>getTaskWithoutParameter(fn: () => Promise<void>, name: string = uuid()): Task<void>;

Generate a ```Task``` object by passing a function without input parameters.
If no ```id``` is passed, an random UUID is generated.


### GulpMinion

A generator of gulp.js tasks.

#### <a id="parallel-tasks"></a>constructParallelGulpTasks<T>(name: string, tasks: Task<T>[], concurrencyLimit: number = Number.MAX_SAFE_INTEGER): string;

Construct a gulp.js task that executes the given ```tasks``` in parallel.
The passed ```name``` is the name of the generated gulp.js task.
You can optionally use ```concurrencyLimit``` to restrict the number of tasks to be executed.
E.g., if ```concurrencyLimit``` is set to 3 and you pass 7 tasks,
  the tasks 1 to 3 are executed in parallel,
  as soon as those are finished, the tasks 4 to 6 are executed in parallel,
  and after that, the 7th task is executed.
   
#### <a id="sequential-tasks"></a>constructSequentialGulpTask(name: string, taskNames: string[]): string;

Construct a gulp.js task that executes the given ```tasks``` one after another.
The passed ```name``` is the name of the generated gulp.js task.


### TaskRunner

A gulp.js task runner.

#### <a id="execute-tasks"></a>execute(task: string): Promise<void>;

Execute the gulp.js task with name ```task```.


### <a id="ioc-container"></a>Configuration

To ease the setup of the objects, we follow the inversion of control (IoC) principle.
Every object can be retrieved using a provided IoC container as in the following example:
```typescript
/// import the IoC container and the classes of objects that should be setup
import { GulpMinion, iocContainer } from 'gulp-minion';

// retrieve the objects from IoC container
const gulpMinion: GulpMinion = iocContainer.get(GulpMinion);
```
