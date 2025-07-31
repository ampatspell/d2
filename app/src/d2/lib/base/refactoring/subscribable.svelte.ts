import { tick, untrack } from 'svelte';
import { Model } from '../model/base.svelte';
import { addObject, removeObject } from '../utils/array';
import type { VoidCallback } from '../utils/types';

const _subscribed = $state<Subscribable[]>([]);

class SubscribableState {
  constructor(private _subscribable: Subscribable) {}

  private _activations = 0;
  private _cancel = $state<VoidCallback>();
  private _isTouched = false;
  readonly isSubscribed = $derived(!!this._cancel);

  private get _dependencies() {
    return this._subscribable.dependencies ?? [];
  }

  private _shouldSubscribe() {
    return this._isTouched && this._activations > 0 && !this._cancel;
  }

  private _maybeSubscribe() {
    if(this._shouldSubscribe()) {
      this._cancel = $effect.root(() => {
        untrack(() => {
          addObject(_subscribed, this._subscribable);
        });
        this._subscribable.subscribe();
        return () => {
          untrack(() => {
            removeObject(_subscribed, this._subscribable);
          });
        };
      });
    }
  }

  private _maybeUnsubscribe() {
    this._cancel?.();
    this._cancel = undefined;
  }

  private _withDependencies(cb: (child: SubscribableState) => void) {
    this._dependencies.map((child) => cb(stateFor(child)));
  }

  private _maybeActivate() {
    if(this._activations++ === 0) {
      this._maybeSubscribe();
      this._withDependencies(state => state._maybeActivate());
    }
  }

  private async _maybeDeactivate() {
    await tick();
    if (--this._activations === 0) {
      this._withDependencies(state => state._maybeDeactivate());
      this._maybeUnsubscribe();
    }
  }

  touch() {
    this._isTouched = true;
    this._maybeSubscribe();
  }

  activate() {
    this._maybeActivate();
    return () => {
      this._maybeDeactivate();
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Subscribable<O = any> extends Model<O> {
  private _subscribable = new SubscribableState(this);
  readonly isSubscribed = $derived(this._subscribable.isSubscribed);

  subscribe() {}

  readonly dependencies: Subscribable[] | undefined;

  protected _subscribe<T>(cb: () => T): T {
    this._subscribable.touch();
    return cb();
  }

  static get subscribed() {
    return _subscribed;
  }
}

function stateFor(model: undefined): undefined;
function stateFor(model: Subscribable): SubscribableState;
function stateFor(model: Subscribable | undefined): SubscribableState | undefined;

function stateFor(model: Subscribable | undefined): SubscribableState | undefined {
  return model?.['_subscribable'];
}

export const subscribe = (model: Subscribable | undefined) => {
  return untrack(() => stateFor(model)?.activate());
};
