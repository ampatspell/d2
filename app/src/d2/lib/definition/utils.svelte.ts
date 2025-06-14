import type { NodeDefinitionModelOptions } from './node.svelte';
import type { AppDefinitionModelOptions } from './app.svelte';
import type { MarkdownElementDefinitionModelOptions } from './markdown.svelte';
import type { MarkdownElementModel } from '../markdown/element.svelte';
import type { NodeModel, NodeType } from '../nodes/node/node.svelte';
import type { BlockModel, BlockType } from '../blocks/block.svelte';
import type { BlockDefinitionModelOptions } from './block.svelte';

export const app = (opts: AppDefinitionModelOptions) => {
  return (): AppDefinitionModelOptions => opts;
};

export const node = <Type extends NodeType, Node extends NodeModel<Type>>(
  type: Type,
  opts: Omit<NodeDefinitionModelOptions<Type, Node>, 'type'>,
): NodeDefinitionModelOptions<Type, Node> => {
  return {
    type,
    ...opts,
  };
};

export const block = <Type extends BlockType, Block extends BlockModel<Type>>(
  type: Type,
  opts: Omit<BlockDefinitionModelOptions<Type, Block>, 'type'>,
): BlockDefinitionModelOptions<Type, Block> => {
  return {
    type,
    ...opts,
  };
};

export const markdown = <Model extends MarkdownElementModel>(
  type: string,
  opts: Omit<MarkdownElementDefinitionModelOptions<Model>, 'type'>,
) => {
  return {
    type,
    ...opts,
  };
};
