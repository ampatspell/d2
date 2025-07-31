import { browser } from '$app/environment';
import { Deferred } from '../utils/promise';
import { subscribe, type Subscribable } from './subscribable.svelte';

export type HasIsLoaded = {
  readonly isLoaded: boolean;
};

export type HasLoad = {
  load(): Promise<void>;
};

export const preload = async <T extends Subscribable & HasIsLoaded & HasLoad>(model: T): Promise<T> => {
  if (browser) {
    const deferred = new Deferred<T, unknown>();
    const cancel = $effect.root(() => {
      // TODO: Promise.race for timeout
      const tick = async () => {
        await Promise.resolve();
        if (model.isLoaded) {
          cancel();
          deferred.resolve(model);
        }
      };
      $effect(() => {
        return subscribe(model);
      });
      $effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        model.isLoaded;
        tick();
      });
    });
    return deferred.promise;
  } else {
    await model.load();
    if (!model.isLoaded) {
      console.error(`Insufficient load for ${model}`);
    }
    return model;
  }
};
