import { untrack } from 'svelte';
import type { FirebaseModel, FirebaseModelOptions } from './model.svelte.js';
import { removeObject } from '../utils/array.js';

export class Stats {
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
}

export const stats = new Stats();
