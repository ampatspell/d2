import { untrack } from 'svelte';
import type { HasSubscriber } from './subscriber.svelte';
import { removeObject } from '../utils/array';
import { BaseModel } from './base.svelte';
import { description } from '../utils/object';

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

  readonly description = $derived(description(this, { subscribed: this.subscribed.length }));
}

export const modelStats = new ModelStats();
