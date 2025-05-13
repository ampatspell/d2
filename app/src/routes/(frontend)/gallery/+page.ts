import { node } from '$d2/lib/nodes/loader.svelte';
import { GalleryNodeModel } from '$lib/gallery/node.svelte';

export const load = async () => {
  return {
    node: await node.forPath('/gallery', GalleryNodeModel).preload(),
  };
};
