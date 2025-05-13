import type { Component } from 'svelte';
import { Model } from '../base/model/model.svelte';
import type { NodeModel, NodeType } from '../nodes/node.svelte';
import type { NodePropertiesRegistry } from '$lib/registry';
import type { NodesModel } from '../nodes/nodes.svelte';

export type NodeBackendComponent<Type extends NodeType, Node extends NodeModel<Type>> = Component<{
  node: Node;
  nodes: NodesModel;
}>;

export type NodeDefinitionModelOptions<
  Type extends NodeType = NodeType,
  Node extends NodeModel<Type> = NodeModel<Type>,
> = {
  readonly type: Type;
  readonly name: string;
  readonly node: new (...args: ConstructorParameters<typeof NodeModel<Type>>) => Node;
  readonly defaults: (() => NodePropertiesRegistry[Type]) | undefined;
  readonly backend: NodeBackendComponent<Type, Node>;
};

export class NodeDefinitionModel<
  Type extends NodeType = NodeType,
  Model extends NodeModel<Type> = NodeModel<Type>,
> extends Model<NodeDefinitionModelOptions<Type, Model>> {
  readonly type = $derived(this.options.type);
  readonly name = $derived(this.options.name);
  readonly backend = $derived(this.options.backend);
  readonly hasDefaults = $derived(!!this.options.defaults);

  model(...args: ConstructorParameters<typeof NodeModel<Type>>) {
    return new this.options.node(...args);
  }

  defaults() {
    return this.options.defaults?.();
  }
}
