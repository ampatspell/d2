import { SubscribableModel } from '$d2/lib/base/refactoring/subscribable.svelte';
import type { NodeModel, NodeType } from './node.svelte';

export type NodeDetailsModelOptions<Type extends NodeType> = {
  model: NodeModel<Type>;
};

export abstract class NodeDetailsModel<
  Type extends NodeType = NodeType,
  O extends NodeDetailsModelOptions<Type> = NodeDetailsModelOptions<Type>,
> extends SubscribableModel<O> {
  readonly model = $derived(this.options.model);
  readonly path = $derived(this.model.path);
  readonly data = $derived(this.model.data);

  abstract load(): Promise<void>;
  abstract isLoaded: boolean;
}
