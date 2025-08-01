import { tick, untrack } from 'svelte';
import { Model } from '../model/base.svelte';
import { addObject, removeObject } from '../utils/array';
import type { VoidCallback } from '../utils/types';

const _subscribed = $state<SubscribableModel[]>([]);

const _add = (model: SubscribableModel) => {
  untrack(() => {
    addObject(_subscribed, model);
  });
  return () => {
    untrack(() => {
      removeObject(_subscribed, model);
    });
  };
};

class SubscribableModelState {
  constructor(private _subscribable: SubscribableModel) {}

  private _activations = 0;
  private _cancel = $state<VoidCallback>();
  readonly isSubscribed = $derived(!!this._cancel);
  private _isTouched = $state(false);
  private _isLazy = $derived.by(() => isLazy(this._subscribable));
  private _isEagerOrTouched = $derived(!this._isLazy || this._isTouched);
  private _dependencies = $derived.by(() => this._subscribable.dependencies ?? []);

  private get _shouldSubscribe() {
    return this._isEagerOrTouched && this._activations > 0 && !this._cancel;
  }

  private _maybeSubscribe() {
    if (this._shouldSubscribe) {
      this._cancel = $effect.root(() => {
        const stats = _add(this._subscribable);
        this._subscribable.subscribe();
        this._trackDependencies();
        return () => {
          stats();
        };
      });
    }
  }

  private _maybeUnsubscribe() {
    if (this._activations < 1) {
      this._cancel?.();
      this._cancel = undefined;
    }
  }

  private _activateDependencies(source: SubscribableModel[]) {
    const withDeps = <T>(cb: (child: SubscribableModelState) => T): T[] => {
      return untrack(() => {
        return source.map((child) => {
          const state = stateFor(child);
          return cb(state);
        });
      });
    };

    const cancel = withDeps((state) => state.activate());
    return async () => {
      await tick();
      cancel.forEach((fn) => fn());
    };
  }

  private _trackDependencies() {
    $effect(() => {
      const dependencies = this._dependencies;
      return this._activateDependencies(dependencies);
    });
  }

  private _activate() {
    this._activations++;
    this._maybeSubscribe();
  }

  private async _deactivate() {
    await tick();
    this._activations--;
    this._maybeUnsubscribe();
  }

  touch() {
    untrack(() => {
      this._isTouched = true;
      this._maybeSubscribe();
    });
  }

  activate() {
    this._activate();
    return () => {
      this._deactivate();
    };
  }
}

export abstract class SubscribableModel<O = unknown> extends Model<O> {
  private _subscribable = new SubscribableModelState(this);
  readonly isSubscribed = $derived(this._subscribable.isSubscribed);

  subscribe() {}

  abstract dependencies?: SubscribableModel[];

  static get subscribed() {
    return _subscribed;
  }
}

export abstract class LazySubscribableModel<O = unknown> extends SubscribableModel<O> {
  protected _touch<T>(cb: () => T): T {
    stateFor(this).touch();
    return cb();
  }
}

function stateFor(model: undefined): undefined;
function stateFor(model: SubscribableModel): SubscribableModelState;
function stateFor(model: SubscribableModel | undefined): SubscribableModelState | undefined;

function stateFor(model: SubscribableModel | undefined): SubscribableModelState | undefined {
  return model?.['_subscribable'];
}

const isLazy = (model: SubscribableModel) => {
  return model instanceof LazySubscribableModel;
};

export const subscribe = (model: SubscribableModel | undefined) => {
  return untrack(() => stateFor(model)?.activate());
};

export const isSubscribable = (model: unknown): model is SubscribableModel => {
  return model instanceof SubscribableModel;
};

export const asDependencies = (content: unknown) => {
  if (Array.isArray(content)) {
    return content.filter(isSubscribable);
  } else {
    if (isSubscribable(content)) {
      return [content];
    }
  }
};
