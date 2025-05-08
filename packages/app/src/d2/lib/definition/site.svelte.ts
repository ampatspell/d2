import { Model } from '../base/model/model.svelte';
import type { OptionsInput } from '../base/utils/options';
import type { NodeData, NodeType } from '$d2-shared/documents';
import type { Document } from '../base/fire/document.svelte';
import { NodeDefinitionModel, type NodeDefinitionModelOptions } from './node.svelte';

export type SiteDefinitionModelOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly nodes: NodeDefinitionModelOptions<any, any>[];
};

export class SiteDefinitionModel extends Model<SiteDefinitionModelOptions> {
  readonly nodes = $derived(this.options.nodes.map((opts) => new NodeDefinitionModel(opts)));

  byType(type: NodeType): NodeDefinitionModel<NodeType> | undefined {
    return this.nodes.find((node) => node.type === type);
  }

  byDocument(doc: Document<NodeData>) {
    const kind = doc.data?.kind;
    if (kind) {
      return this.byType(kind);
    }
  }
}

let _site = $state<SiteDefinitionModel>();

export const createSiteDefinition = (opts: OptionsInput<SiteDefinitionModelOptions>) => {
  _site = new SiteDefinitionModel(opts);
};

export const getSiteDefinition = () => {
  return _site!;
};
