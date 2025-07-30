import { createSubscriber } from 'svelte/reactivity';
import { untrack } from 'svelte';
import { Model } from '../model/base.svelte';
import { addObject, removeObject } from '../utils/array';

const _subscribed = $state<Subscribable[]>([]);

export class Subscribable<O = unknown> extends Model<O> {
  private _isSubscribed = $state(false);
  private _subscriber: ReturnType<typeof createSubscriber> | undefined;

  readonly isSubscribed = $derived(this._isSubscribed);

  subscribe() {}

  protected _subscribe<T>(cb: () => T): T {
    if (!this._subscriber) {
      this._subscriber = createSubscriber(() => {
        return $effect.root(() => {
          this.subscribe();
          untrack(() => {
            this._isSubscribed = true;
            addObject(_subscribed, this);
          });
          return () => {
            untrack(() => {
              removeObject(_subscribed, this);
              this._isSubscribed = false;
            });
            this._subscriber = undefined;
          };
        });
      });
    }
    this._subscriber();
    return cb();
  }

  static get subscribed() {
    return _subscribed;
  }
}
