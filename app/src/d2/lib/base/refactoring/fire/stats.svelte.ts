import { untrack } from 'svelte';
import type { FirebaseModel, FirebaseModelOptions } from './model.svelte';
import { BaseModel } from '../../model/base.svelte';
import { removeObject } from '../../utils/array';
import { description } from '../../utils/object';

export class FireStats extends BaseModel {
  listening = $state<FirebaseModel<FirebaseModelOptions>[]>([]);

  _registerListening(model: FirebaseModel<FirebaseModelOptions>) {
    untrack(() => {
      this.listening.push(model);
    });
    return () => {
      untrack(() => {
        removeObject(this.listening, model);
      });
    };
  }

  serialized = $derived.by(() => {
    const { listening } = this;
    const map = <T extends object>(arr: T[]) => arr.map((item) => item.toString());
    return {
      listening: map(listening),
    };
  });

  readonly description = $derived(description(this, { listening: this.listening.length }));
}

export const fireStats = new FireStats();
