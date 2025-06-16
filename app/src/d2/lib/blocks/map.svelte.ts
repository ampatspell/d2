import { isLoaded } from '../base/fire/is-loaded.svelte';
import { Subscribable } from '../base/model/model.svelte';
import { mapModel } from '../base/model/models.svelte';
import { getter, type OptionsInput } from '../base/utils/options';
import { getDefinition } from '../definition/app.svelte';
import type { BlockProperty } from '../nodes/node/node.svelte';
import type { BlockType } from './block.svelte';

export type MapBlockOptions<Type extends BlockType> = {
  source: BlockProperty<Type> | undefined;
};

export class MapBlock<Type extends BlockType = BlockType> extends Subscribable<MapBlockOptions<Type>> {
  private readonly _source = $derived(this.options.source);

  private readonly _block = mapModel({
    source: getter(() => this._source),
    target: (data) => getDefinition().blockByType(data.kind).model({ data }),
    key: (data) => data.kind,
  });

  readonly block = $derived(this._block.content);

  async load() {
    await this._block.load((model) => model.load());
  }

  readonly isLoaded = $derived(isLoaded([this.block]));
  readonly dependencies = [this._block];
}

export const block = <Type extends BlockType = BlockType>(
  opts: OptionsInput<{
    data: BlockProperty<Type> | undefined;
  }>,
) => {
  return new MapBlock<Type>({ source: opts.data });
};
