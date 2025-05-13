import { Model } from '../base/model/model.svelte';
import type { OptionsInput } from '../base/utils/options';
import type { Document } from '../base/fire/document.svelte';
import { NodeDefinitionModel, type NodeDefinitionModelOptions } from './node.svelte';
import type { NodeData, NodeType } from '../nodes/node.svelte';
import { unknown } from './unknown/definition.svelte';

export type AppDefinitionModelOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly nodes: NodeDefinitionModelOptions<any, any>[];
};

export class AppDefinitionModel extends Model<AppDefinitionModelOptions> {
  readonly nodes = $derived(this.options.nodes.map((opts) => new NodeDefinitionModel(opts)));
  readonly nodesWithDefaults = $derived(this.nodes.filter((node) => node.hasDefaults));
  private readonly unknown = new NodeDefinitionModel(unknown());

  byType(type: NodeType | undefined): NodeDefinitionModel<NodeType> {
    const definition = this.nodes.find((node) => node.type === type);
    if (definition) {
      return definition;
    }
    return this.unknown as unknown as NodeDefinitionModel<NodeType>;
  }

  byDocument(doc: Document<NodeData>) {
    const kind = doc.data?.kind;
    return this.byType(kind);
  }
}

let _app = $state<AppDefinitionModel>();

export const createDefinition = (opts: OptionsInput<AppDefinitionModelOptions>) => {
  _app = new AppDefinitionModel(opts);
};

export const getDefinition = () => {
  return _app!;
};
