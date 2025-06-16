import type { BlockPropertiesRegistry } from '$lib/definition/registry';
import { Subscribable } from '../base/model/model.svelte';
import { serialized } from '../base/utils/object';
import { getDefinition } from '../definition/app.svelte';
import type { BlockProperty } from '../nodes/node/node.svelte';

export type BlockType = keyof BlockPropertiesRegistry;

export type BlockModelFactory<Model extends BlockModel> = {
  new (...args: ConstructorParameters<typeof BlockModel<never>>): Model;
};

export type BlockModelOptions<Type extends BlockType> = {
  data: BlockProperty<Type>;
};

export class BlockModel<Type extends BlockType = BlockType> extends Subscribable<BlockModelOptions<Type>> {
  readonly data = $derived(this.options.data);
  readonly kind = $derived(this.data.kind);

  readonly definition = $derived(getDefinition().blockByType(this.kind));

  async load() {}

  readonly isLoaded = true;
  readonly dependencies = [];

  readonly serialized = $derived(serialized(this, ['kind']));
}
