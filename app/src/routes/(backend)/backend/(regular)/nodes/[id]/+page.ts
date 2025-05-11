import { preloadModel } from '$d2/lib/base/fire/preload.svelte';
import { NodeModel } from '$d2/lib/nodes/loader.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  const node = NodeModel.forId(event.params.id);
  return {
    node: await preloadModel(node),
  };
};
