import { untrack } from 'svelte';
import type { HasSubscriber } from './subscriber.svelte';
import { removeObject } from '../utils/array';
import { BaseModel } from './base.svelte';

export class ModelStats extends BaseModel {
  subscribed = $state<HasSubscriber[]>([]);

  _registerSubscribed(model: HasSubscriber) {
    untrack(() => {
      this.subscribed.push(model);
    });
    return () => {
      untrack(() => {
        removeObject(this.subscribed, model);
      });
    };
  }

  serialized = $derived.by(() => {
    const { subscribed } = this;
    return {
      subscribed: subscribed.map((item) => item.toString()),
    };
  });
}

export const stats = new ModelStats();
