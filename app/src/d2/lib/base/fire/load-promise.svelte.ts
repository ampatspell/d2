import { deferred } from '../utils/promise';

export type LoadPromiseType = 'cached' | 'remote';

export class LoadPromises<T, E> {
  private _cached = $state(deferred());
  private _remote = $state(deferred());

  _onWillLoad() {
    this._cached = deferred();
    this._remote = deferred();
  }

  _onDidLoad(model: T, type: LoadPromiseType) {
    this._cached.resolve(model);
    if (type === 'remote') {
      this._remote.resolve(model);
    }
  }

  _onError(error: E) {
    this._cached.reject(error);
    this._remote.reject(error);
  }

  cached = $derived(this._cached.promise);
  remote = $derived(this._remote.promise);
}

export type HasLoadPromises<T, E> = {
  promises: LoadPromises<T, E>;
};

export type HasLoad<T = unknown> = {
  load: () => Promise<T>;
};

export const load = async (models: HasLoadPromises<unknown, unknown>[], key: LoadPromiseType) => {
  await Promise.all(models.map((model) => model.promises[key]));
};
