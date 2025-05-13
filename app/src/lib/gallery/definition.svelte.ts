import { node } from '$d2/lib/definition/utils.svelte';
import Backend from './backend.svelte';
import { GalleryNodeModel } from './node.svelte';

export type GalleryNodeProperties = {
  title: string;
  images?: string;
};

export const gallery = () => {
  return node('gallery', {
    name: 'Gallery',
    node: GalleryNodeModel,
    defaults: () => ({
      title: 'Gallery',
    }),
    backend: Backend,
  });
};
