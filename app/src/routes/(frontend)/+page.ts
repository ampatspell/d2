import { preloadModel } from '$d2/lib/base/fire/preload.svelte';
import { NodeDocumentModelLoader } from '$d2/lib/nodes/loader.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  return {
    foof: await preloadModel(NodeDocumentModelLoader.forPath('/public/random')),
    image: await preloadModel(NodeDocumentModelLoader.forPath('/public/random/film-0018-010')),
  };
};
