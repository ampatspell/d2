import { preloadModel } from '$d2/lib/base/fire/preload.svelte';
import { SubscriptionsModel } from '$d2/lib/subscriptions/subscriptions.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  return {
    subscriptions: await preloadModel(new SubscriptionsModel(undefined)),
  };
};
