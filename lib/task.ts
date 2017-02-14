export default class Task<T> {
  constructor(private _id: string,
              private _fn: (parameter: T) => Promise<void>,
              private _parameter?: T) {
  }

  public get id(): string {
    return this._id;
  }

  public get fn(): (parameter: T) => Promise<void> {
    return this._fn;
  }

  public get parameter(): T {
    return this._parameter;
  }
}