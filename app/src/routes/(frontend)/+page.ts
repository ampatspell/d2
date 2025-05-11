import { node, nodes } from '$d2/lib/nodes/loader.svelte';
import { FileNodeDocumentModel } from '$lib/file/node.svelte';
import { IndexNodeDocumentModel } from '$lib/index/node.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  return {
    index: await node.forPath('/index', IndexNodeDocumentModel).preload(),
    images: await nodes.forParentId('pJvLadgkfITfGjehPE2s', FileNodeDocumentModel).preload(),
  };
};
