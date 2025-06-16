import { Model } from '../base/model/model.svelte';
import type { OptionsInput } from '../base/utils/options';
import type { Document } from '../base/fire/document.svelte';
import { NodeDefinitionModel, type NodeDefinitionModelOptions } from './node.svelte';
import { MarkdownElementDefinitionModel, type MarkdownElementDefinitionModelOptions } from './markdown.svelte';
import type { NodeData, NodeType } from '../nodes/node/node.svelte';
import { BlockDefinitionModel, type BlockDefinitionModelOptions } from './block.svelte';
import type { BlockType } from '../blocks/block.svelte';
import { unknown as unknownNode } from './unknown/node/definition.svelte';
import { unknown as unknownBlock } from './unknown/block/definition.svelte';

export type AppDefinitionModelOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly nodes: NodeDefinitionModelOptions<any, any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly blocks: BlockDefinitionModelOptions<any, any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly elements?: MarkdownElementDefinitionModelOptions<any>[];
};

export class AppDefinitionModel extends Model<AppDefinitionModelOptions> {
  readonly nodes = $derived.by(() => {
    return this.options.nodes.map((opts) => new NodeDefinitionModel(opts));
  });

  readonly nodesWithDefaults = $derived(this.nodes.filter((node) => node.hasDefaults));

  readonly elements = $derived.by(() => {
    const markdown = this.options.elements ?? [];
    return markdown.map((opts) => new MarkdownElementDefinitionModel(opts));
  });

  readonly blocks = $derived.by(() => {
    return this.options.blocks.map((opts) => new BlockDefinitionModel(opts));
  });

  private readonly unknownNode = new NodeDefinitionModel(unknownNode());
  private readonly unknownBlock = new BlockDefinitionModel(unknownBlock());

  nodeByType(type: NodeType | undefined): NodeDefinitionModel<NodeType> {
    const definition = this.nodes.find((node) => node.type === type);
    if (definition) {
      return definition;
    }
    return this.unknownNode as unknown as NodeDefinitionModel<NodeType>;
  }

  nodeByDocument(doc: Document<NodeData>) {
    const kind = doc.data?.kind;
    return this.nodeByType(kind);
  }

  blockByType(type: BlockType | undefined): BlockDefinitionModel<BlockType> {
    const definition = this.blocks.find((block) => block.type === type);
    if (definition) {
      return definition;
    }
    return this.unknownBlock as unknown as BlockDefinitionModel<BlockType>;
  }

  elementByType(type: string) {
    return this.elements.find((markdown) => markdown.type === type);
  }
}

let _definition = $state<AppDefinitionModel>();

export const createDefinition = (opts: OptionsInput<AppDefinitionModelOptions>) => {
  _definition = new AppDefinitionModel(opts);
};

export const getDefinition = () => {
  return _definition!;
};
