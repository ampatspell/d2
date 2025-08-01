import { tick, untrack } from 'svelte';
import { Model } from '../model/base.svelte';
import { addObject, removeObject } from '../utils/array';
import type { VoidCallback } from '../utils/types';

const _subscribed = $state<SubscribableModel[]>([]);

class SubscribableModelState {
  constructor(private _subscribable: SubscribableModel) {}

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
    if (this._shouldSubscribe()) {
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

  private _withDependencies(cb: (child: SubscribableModelState) => void) {
    this._dependencies.map((child) => cb(stateFor(child)));
  }

  private _maybeActivate() {
    if (this._activations++ === 0) {
      this._maybeSubscribe();
      this._withDependencies((state) => state._maybeActivate());
    }
  }

  private async _maybeDeactivate() {
    await tick();
    if (--this._activations === 0) {
      this._withDependencies((state) => state._maybeDeactivate());
      this._maybeUnsubscribe();
    }
  }

  touch() {
    untrack(() => {
      this._isTouched = true;
      this._maybeSubscribe();
    });
  }

  activate() {
    this._maybeActivate();
    return () => {
      this._maybeDeactivate();
    };
  }
}

export abstract class SubscribableModel<O = unknown> extends Model<O> {
  private _subscribable = new SubscribableModelState(this);
  readonly isSubscribed = $derived(this._subscribable.isSubscribed);

  subscribe() {}

  /**
   * Dependencies must be stable
   */
  abstract dependencies?: SubscribableModel[];

  protected _subscribe<T>(cb: () => T): T {
    this._subscribable.touch();
    return cb();
  }

  static get subscribed() {
    return _subscribed;
  }
}

function stateFor(model: undefined): undefined;
function stateFor(model: SubscribableModel): SubscribableModelState;
function stateFor(model: SubscribableModel | undefined): SubscribableModelState | undefined;

function stateFor(model: SubscribableModel | undefined): SubscribableModelState | undefined {
  return model?.['_subscribable'];
}

export const subscribe = (model: SubscribableModel | undefined) => {
  return untrack(() => stateFor(model)?.activate());
};
