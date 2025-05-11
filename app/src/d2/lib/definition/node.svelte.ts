import type { Component } from 'svelte';
import { Model } from '../base/model/model.svelte';
import type { NodeDocumentModel, NodeType } from '../nodes/node.svelte';
import type { NodePropertiesRegistry } from '$lib/registry';

export type NodeBackendComponent<Type extends NodeType, Node extends NodeDocumentModel<Type>> = Component<{
  node: Node;
}>;

export type NodeDefinitionModelOptions<
  Type extends NodeType = NodeType,
  Node extends NodeDocumentModel<Type> = NodeDocumentModel<Type>,
> = {
  readonly type: Type;
  readonly name: string;
  readonly node: new (...args: ConstructorParameters<typeof NodeDocumentModel<Type>>) => Node;
  readonly defaults: (() => NodePropertiesRegistry[Type]) | undefined;
  readonly backend: NodeBackendComponent<Type, Node>;
};

export class NodeDefinitionModel<
  Type extends NodeType = NodeType,
  Model extends NodeDocumentModel<Type> = NodeDocumentModel<Type>,
> extends Model<NodeDefinitionModelOptions<Type, Model>> {
  readonly type = $derived(this.options.type);
  readonly name = $derived(this.options.name);
  readonly backend = $derived(this.options.backend);
  readonly hasDefaults = $derived(!!this.options.defaults);

  model(...args: ConstructorParameters<typeof NodeDocumentModel<Type>>) {
    return new this.options.node(...args);
  }

  defaults() {
    return this.options.defaults?.();
  }
}
