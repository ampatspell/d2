import { preload } from '$d2/lib/base/model/preload.svelte';
import { SubscriptionsModel } from '$d2/lib/subscriptions/subscriptions.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  return {
    subscriptions: await preload(new SubscriptionsModel(undefined)),
  };
};
