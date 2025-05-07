import type { NodeType, NodeTypes } from '$d2-shared/documents';
import { Model } from '../base/model/model.svelte';
import type { NodeDocumentModel } from '../nodes/node.svelte';

export type NodeDefinitionModelOptions<Type extends NodeType = NodeType> = {
  readonly type: Type;
  readonly model: typeof NodeDocumentModel<Type>;
  readonly defaults: () => NodeTypes[Type];
};

export class NodeDefinitionModel<Type extends NodeType> extends Model<NodeDefinitionModelOptions<Type>> {
  readonly type = $derived(this.options.type);

  model(...args: ConstructorParameters<typeof NodeDocumentModel<Type>>) {
    return new this.options.model(...args);
  }

  defaults() {
    return this.options.defaults();
  }
}
