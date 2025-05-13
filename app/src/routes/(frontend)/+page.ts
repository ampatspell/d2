import { node } from '$d2/lib/nodes/loader.svelte';
import { IndexNodeModel } from '$lib/definition/index/node.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  return {
    loader: await node
      .forPath({
        path: '/public',
        factory: IndexNodeModel,
      })
      .preload(),
  };
};
