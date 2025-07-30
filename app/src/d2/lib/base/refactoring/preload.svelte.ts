import { browser } from '$app/environment';
import type { Subscribable } from './subscribable.svelte';

export type HasIsLoaded = {
  readonly isLoaded: boolean;
};

export type HasLoad = {
  load(): Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const preload = async <T extends Subscribable<any> & HasIsLoaded & HasLoad>(model: T): Promise<T> => {
  if (browser) {
    return new Promise<T>((resolve) => {
      const cancel = $effect.root(() => {
        $effect(() => {
          if (model.isLoaded) {
            resolve(model);
            cancel();
          }
        });
      });
    });
  } else {
    await model.load();
    if (!model.isLoaded) {
      console.error(`Insufficient load for ${model}`);
    }
    return model;
  }
};
