import type { NodeType } from '$d2-shared/documents';
import type { NodeDocumentModel } from '../nodes/node.svelte';
import type { NodeDefinitionModelOptions } from './node.svelte';

export const node = <Type extends NodeType, Node extends NodeDocumentModel<Type>>(
  type: Type,
  opts: Omit<NodeDefinitionModelOptions<Type, Node>, 'type'>,
): NodeDefinitionModelOptions<Type, Node> => {
  return {
    type,
    ...opts,
  };
};
