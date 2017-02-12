declare class Task<T> {
  id: string;
  fn: (parameter: T) => Promise<void>;
  parameter: T;
}

export default Task;