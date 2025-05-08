import type { NodeType, NodeTypes } from '$d2-shared/documents';
import type { Component } from 'svelte';
import { Model } from '../base/model/model.svelte';
import type { NodeDocumentModel } from '../nodes/node.svelte';

export type NodeBackendComponent<Type extends NodeType, Node extends NodeDocumentModel<Type>> = Component<{
  node: Node;
}>;

export type NodeDefinitionModelOptions<
  Type extends NodeType = NodeType,
  Node extends NodeDocumentModel<Type> = NodeDocumentModel<Type>,
> = {
  readonly type: Type;
  readonly node: new (...args: ConstructorParameters<typeof NodeDocumentModel<Type>>) => Node;
  readonly defaults: () => NodeTypes[Type];
  readonly backend: NodeBackendComponent<Type, Node>;
};

export class NodeDefinitionModel<
  Type extends NodeType = NodeType,
  Model extends NodeDocumentModel<Type> = NodeDocumentModel<Type>,
> extends Model<NodeDefinitionModelOptions<Type, Model>> {
  readonly type = $derived(this.options.type);

  model(...args: ConstructorParameters<typeof NodeDocumentModel<Type>>) {
    return new this.options.node(...args);
  }

  defaults() {
    return this.options.defaults();
  }

  readonly backend = $derived(this.options.backend);
}
