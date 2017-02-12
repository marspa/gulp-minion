declare class TaskRunner {
  execute(task: string): Promise<void>;
}

export default TaskRunner;