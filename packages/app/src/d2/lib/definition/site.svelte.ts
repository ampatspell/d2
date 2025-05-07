import { Model } from '../base/model/model.svelte';
import type { OptionsInput } from '../base/utils/options';
import type { NodeData, NodeType, NodeTypes } from '$d2-shared/documents';
import type { NodeDocumentModel } from '../nodes/node.svelte';
import type { Document } from '../base/fire/document.svelte';

export type SiteDefinitionModelOptions = {
  readonly nodes: NodeDefinitionModelOptions[];
};

export class SiteDefinitionModel extends Model<SiteDefinitionModelOptions> {
  readonly nodes = $derived.by(() => {
    return this.options.nodes.map((opts) => new NodeDefinitionModel(opts));
  });

  byType(type: NodeType): NodeDefinitionModel<NodeType> | undefined {
    return this.nodes.find((node) => node.type === type);
  }

  byDocument(doc: Document<NodeData>) {
    const kind = doc.data?.kind;
    if(kind) {
      return this.byType(kind);
    }
  }
}

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

//

let _site = $state<SiteDefinitionModel>();

export const createSiteDefinition = (opts: OptionsInput<SiteDefinitionModelOptions>) => {
  _site = new SiteDefinitionModel(opts);
};

export const getSiteDefinition = () => {
  return _site!;
};

//

export const node = <Type extends NodeType>(
  type: Type,
  opts: Omit<NodeDefinitionModelOptions<Type>, 'type'>,
): NodeDefinitionModelOptions<Type> => {
  return {
    type,
    ...opts,
  };
};
