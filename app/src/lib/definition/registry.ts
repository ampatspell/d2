import type { FunctionsNodePropertiesRegistry } from '$d2-shared/nodes/registry';
import { file } from '$d2/lib/definition/file/definition.svelte';
import { app } from '$d2/lib/definition/utils.svelte';
import { gallery, type GalleryNodeProperties } from './gallery/definition.svelte';
import { index, type IndexNodeProperties } from './index/definition.svelte';

export type NodePropertiesRegistry = FunctionsNodePropertiesRegistry & {
  index: IndexNodeProperties;
  gallery: GalleryNodeProperties;
};

export const definition = app({
  nodes: [file(), index(), gallery()],
});
