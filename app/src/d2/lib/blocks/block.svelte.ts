import type { BlockPropertiesRegistry } from '$lib/definition/registry';
import { Subscribable } from '../base/model/model.svelte';

export type BlockType = keyof BlockPropertiesRegistry;

export type BlockModelFactory<Model extends BlockModel> = {
  new (...args: ConstructorParameters<typeof BlockModel<never>>): Model;
};

export type BlockModelOptions<Type extends BlockType> = {
  data: Type;
};

export class BlockModel<Type extends BlockType = BlockType> extends Subscribable<BlockModelOptions<Type>> {
  isLoaded = true;
  dependencies = [];
}
