import { browser, dev } from '$app/environment';
import type { Subscribable } from '../model/model.svelte';
import { subscribe } from '../model/subscriber.svelte';
import { Deferred } from '../utils/promise';
import { scope } from '../utils/scope';

export type PreloadModel = Subscribable<unknown> & {
  isLoaded: boolean;
  load: () => Promise<void>;
};

export const preloadModel = <T extends PreloadModel>(model: T, subscribeInBrowser: boolean = false): Promise<T> => {
  const deferred = new Deferred<T, unknown>();

  // TODO: I'm not sure that subscribe really makes sense here. If for the most part ssr is preferred, load() is anyway is needed
  if (browser && subscribeInBrowser) {
    const cancel = $effect.root(() => {
      const tick = async () => {
        await Promise.resolve();
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
