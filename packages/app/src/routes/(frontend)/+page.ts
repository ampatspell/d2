import { preloadModel } from '$d2/lib/base/fire/preload.svelte';
import { NodeDocumentModelLoader } from '$d2/lib/nodes/loader.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const loader = NodeDocumentModelLoader.forIdentifier('foof');
  return {
    loader: await preloadModel(loader),
  };
};
