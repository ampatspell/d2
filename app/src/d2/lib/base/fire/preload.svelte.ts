import { browser, dev } from '$app/environment';
import type { Subscribable } from '../model/model.svelte';
import { subscribe } from '../model/subscriber.svelte';
import { Deferred } from '../utils/promise';
import { scope } from '../utils/scope';

export type PreloadModel = Subscribable<unknown> & {
  isLoaded: boolean;
  load: () => Promise<void>;
};

const later = async (delay: number) => {
  await new Promise((resolve) => setTimeout(resolve, delay));
};

export const preloadModel = <T extends PreloadModel>(model: T): Promise<T> => {
  const deferred = new Deferred<T, unknown>();

  if (browser) {
    const cancel = $effect.root(() => {
      const tick = async () => {
        await later(50); // TODO next tick, microtask or whatever doesn't cross isLoaded -> !isLoaded fence
        if (model.isLoaded) {
          cancel();
          deferred.resolve(model);
        }
      };
      $effect(() => subscribe(model));
      $effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        model.isLoaded;
        tick();
      });
    });
  } else {
    const log = (...args: unknown[]) => {
      if (dev) {
        console.log(...args);
      }
    };
    scope(async () => {
      await model.load();
      if (!model.isLoaded) {
        log(model + '', 'insufficient load');
      }
      deferred.resolve(model);
    });
  }

  return deferred.promise;
};
