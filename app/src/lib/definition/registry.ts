import type { FunctionsNodePropertiesRegistry } from '$d2-shared/nodes/registry';
import { file } from '$d2/lib/definition/file/definition.svelte';
import { app } from '$d2/lib/definition/utils.svelte';
import { gallery, type GalleryNodeProperties } from './nodes/gallery/definition.svelte';
import { box } from './elements/box/definition.svelte';
import { link } from './elements/link/definition.svelte';
import { markdown, type MarkdownBlockProperties } from './blocks/markdown/definition.svelte';
import { index, type IndexNodeProperties } from './nodes/index/definition.svelte';

export type NodePropertiesRegistry = FunctionsNodePropertiesRegistry & {
  index: IndexNodeProperties;
  gallery: GalleryNodeProperties;
};

export type BlockPropertiesRegistry = {
  markdown: MarkdownBlockProperties;
};

export const definition = app({
  nodes: [file(), index(), gallery()],
  blocks: [markdown()],
  elements: [link(), box()],
});
