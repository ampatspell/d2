import { Subscribable } from '$d2/lib/base/model/model.svelte';
import type { NodeModel, NodeType } from './node.svelte';

export type NodeDetailsModelOptions<Type extends NodeType> = {
  model: NodeModel<Type>;
};

export abstract class NodeDetailsModel<
  Type extends NodeType = NodeType,
  O extends NodeDetailsModelOptions<Type> = NodeDetailsModelOptions<Type>,
> extends Subscribable<O> {
  readonly model = $derived(this.options.model);
  readonly path = $derived(this.model.path);
  readonly data = $derived(this.model.data);
  readonly properties = $derived(this.data.properties);

  abstract load(): Promise<void>;
  abstract isLoaded: boolean;
}
