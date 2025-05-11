import { node } from '$d2/lib/nodes/loader.svelte';
import { IndexNodeDocumentModel } from '$lib/index/node.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  return {
    index: await node.forPath('/index', IndexNodeDocumentModel).preload(),
  };
};
