import { node } from '$d2/lib/nodes/loader.svelte';
import { GalleryNodeModel } from '$lib/definition/nodes/gallery/node.svelte';

export const load = async () => {
  return {
    loader: await node
      .forPath({
        path: '/gallery',
        factory: GalleryNodeModel,
      })
      .preload(),
  };
};
