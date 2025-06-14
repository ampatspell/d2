import type { BlockPropertiesRegistry } from '$lib/definition/registry';
import { Model } from '../base/model/model.svelte';
import type { BlockModel, BlockType } from '../blocks/block.svelte';

export type BlockDefinitionModelOptions<
  Type extends BlockType = BlockType,
  Block extends BlockModel<Type> = BlockModel<Type>,
> = {
  readonly type: Type;
  readonly name: string;
  readonly model: new (...args: ConstructorParameters<typeof BlockModel<Type>>) => Block;
  readonly defaults: (() => BlockPropertiesRegistry[Type]) | undefined;
};

export class BlockDefinitionModel<
  Type extends BlockType = BlockType,
  Block extends BlockModel<Type> = BlockModel<Type>,
> extends Model<BlockDefinitionModelOptions<Type, Block>> {}
