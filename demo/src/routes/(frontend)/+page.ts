import { FileNodeDocumentModel } from '$d2/lib/definition/file/node.svelte';
import { node, nodes } from '$d2/lib/nodes/loader.svelte';
import { IndexNodeDocumentModel } from '$lib/index/node.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  return {
    index: await node.forPath('/hello', IndexNodeDocumentModel).preload(),
    images: await nodes.forParentPath('/hello/images', FileNodeDocumentModel).preload(),
  };
};
