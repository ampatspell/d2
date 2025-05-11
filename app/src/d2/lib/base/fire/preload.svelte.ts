import { browser, dev } from '$app/environment';
import type { Subscribable } from '../model/model.svelte';
import { subscribe } from '../model/subscriber.svelte';
import { Deferred } from '../utils/promise';
import { scope } from '../utils/scope';

export type PreloadModel = Subscribable<unknown> & {
  isLoaded: boolean;
  load?: () => Promise<void>;
};

export const preloadModel = <T extends PreloadModel>(model: T, isLoaded?: () => boolean | undefined): Promise<T> => {
  isLoaded = isLoaded ?? (() => true);

  const deferred = new Deferred<T, unknown>();

  if (browser) {
    console.log('> preload', model+'');
    const cancel = $effect.root(() => {
      $effect.pre(() => subscribe(model));
      $effect.pre(() => {
        if (model.isLoaded && isLoaded() !== false) {
          scope(async () => {
            console.log('< preload', model+'');
            await Promise.resolve();
            cancel();
            deferred.resolve(model);
          });
        }
      });
    });
  } else {
    const log = (...args: unknown[]) => {
      if (dev) {
        console.log(...args);
      }
    };
    scope(async () => {
      if (model.load) {
        await model.load();
        if (!model.isLoaded) {
          log(model + '', 'insufficient load');
        }
      } else {
        log(model + '', 'missing load');
      }
      deferred.resolve(model);
    });
  }

  return deferred.promise;
};
