import type { FunctionsNodePropertiesRegistry } from '$d2-shared/nodes/registry';
import type { BlankNodeProperties } from './blank/definition.svelte';
import type { GalleryNodeProperties } from './gallery/definition.svelte';

export type NodePropertiesRegistry = FunctionsNodePropertiesRegistry & {
  blank: BlankNodeProperties;
  gallery: GalleryNodeProperties;
};
