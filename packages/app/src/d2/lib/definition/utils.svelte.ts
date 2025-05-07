import type { NodeType } from '$d2-shared/documents';
import type { NodeDefinitionModelOptions } from './node.svelte';

export const node = <Type extends NodeType>(
  type: Type,
  opts: Omit<NodeDefinitionModelOptions<Type>, 'type'>,
): NodeDefinitionModelOptions<Type> => {
  return {
    type,
    ...opts,
  };
};
