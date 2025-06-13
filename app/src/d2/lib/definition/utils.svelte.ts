import type { NodeModel, NodeType } from '../nodes/node.svelte';
import type { NodeDefinitionModelOptions } from './node.svelte';
import type { AppDefinitionModelOptions } from './app.svelte';
import type { MarkdownElementDefinitionModelOptions } from './markdown.svelte';

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

export const markdown = (type: string, opts: Omit<MarkdownElementDefinitionModelOptions, 'type'>) => {
  return {
    type,
    ...opts,
  };
};
