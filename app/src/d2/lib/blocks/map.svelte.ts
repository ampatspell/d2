import { isLoaded } from '../base/fire/is-loaded.svelte';
import { Subscribable } from '../base/model/model.svelte';
import { mapModel } from '../base/model/models.svelte';
import { serialized } from '../base/utils/object';
import { getter, type OptionsInput } from '../base/utils/options';
import type { Property } from '../base/utils/property.svelte';
import { getDefinition } from '../definition/app.svelte';
import type { BlockProperty } from '../nodes/node/node.svelte';
import type { BlockType } from './block.svelte';

export type MapBlockOptions<Type extends BlockType> = {
  property: Property<BlockProperty<Type> | undefined>;
};

export class MapBlock<Type extends BlockType = BlockType> extends Subscribable<MapBlockOptions<Type>> {
  readonly property = $derived(this.options.property);

  private readonly _block = mapModel({
    source: getter(() => this.property.value),
    target: (data) => getDefinition().blockByType(data.kind).model({ data }),
    key: (data) => data.kind,
  });

  readonly block = $derived(this._block.content);

  async load() {
    await this._block.load((model) => model.load());
  }

  clear() {
    this.property.update(undefined);
  }

  replaceWith<Type extends BlockType>(kind: Type) {
    const definition = getDefinition().blockByType(kind);
    // TODO: this should be constrained
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.property.update(definition.data() as any);
  }

  readonly isLoaded = $derived(isLoaded([this.block]));
  readonly dependencies = [this._block];

  readonly serialized = $derived(serialized(this, ['block']));
}

export const block = <Type extends BlockType = BlockType>(
  opts: OptionsInput<{
    property: Property<BlockProperty<Type> | undefined>;
  }>,
) => {
  return new MapBlock<Type>({ property: opts.property });
};
