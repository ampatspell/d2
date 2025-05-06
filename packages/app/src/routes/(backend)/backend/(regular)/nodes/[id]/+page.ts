import { preloadModel } from '$d2/lib/base/fire/preload.svelte';
import { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  const node = NodeDocumentModel.forId(event.params.id);
  return {
    node: await preloadModel(node),
  };
};
