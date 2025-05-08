import { preloadModel } from '$d2/lib/base/fire/preload.svelte';
import { NodeDocumentModelLoader } from '$d2/lib/nodes/node.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const loader = NodeDocumentModelLoader.forId('3QzardCUYRvfIXg83Q1r');
  return {
    loader: await preloadModel(loader),
  };
};
