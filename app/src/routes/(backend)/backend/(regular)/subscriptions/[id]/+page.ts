import { preload } from '$d2/lib/base/refactoring/preload.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  const { subscriptions } = await event.parent();
  const subscription = subscriptions.byId(event.params.id);
  return {
    subscription: subscription ? await preload(subscription) : undefined,
  };
};
