import { browser, dev } from '$app/environment';
import type { Subscribable } from '../model/model.svelte';
import { subscribe } from '../model/subscriber.svelte';
import { Deferred } from '../utils/promise';
import { scope } from '../utils/scope';

export type PreloadModel = Subscribable<unknown> & {
  isLoaded: boolean;
  load: () => Promise<void>;
};

export const preloadModel = <T extends PreloadModel>(model: T): Promise<T> => {
  const deferred = new Deferred<T, unknown>();

  if (browser) {
    const cancel = $effect.root(() => {
      const tick = async () => {
        await Promise.resolve();
        if (model.isLoaded) {
          await Promise.resolve();
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
