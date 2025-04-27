export const delay = async (ms: number) => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
};

type PromiseParams<T> = Parameters<ConstructorParameters<typeof Promise<T>>[0]>;
type PromiseResolve<T> = PromiseParams<T>[0];
type PromiseReject<T> = PromiseParams<T>[1];

export class Deferred<T, E> {
  private _resolve!: PromiseResolve<T>;
  private _reject!: PromiseReject<E>;

  readonly promise: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  resolve(model: T) {
    this._resolve(model);
  }

  reject(err: E) {
    this._reject(err);
  }
}

export const deferred = <T, E>() => new Deferred<T, E>();
