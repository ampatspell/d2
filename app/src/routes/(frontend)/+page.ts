import { preloadModel } from '$d2/lib/base/fire/preload.svelte';
import { NodeDocumentModelLoader } from '$d2/lib/nodes/loader.svelte';
import { IndexNodeDocumentModel } from '$lib/index/node.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  return {
    index: await preloadModel(NodeDocumentModelLoader.forPath('/index', IndexNodeDocumentModel)),
  };
};
