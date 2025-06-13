import { isLoaded } from '../base/fire/is-loaded.svelte';
import { Subscribable } from '../base/model/model.svelte';
import { mapModels } from '../base/model/models.svelte';
import { getter, type OptionsInput } from '../base/utils/options';
import { parse, type MarkdownRoot } from './tree';

export type MarkdownModelOptions = {
  string: string | undefined;
};

export class MarkdownModel extends Subscribable<MarkdownModelOptions> {
  private _root = $state<MarkdownRoot>();
  readonly root = $derived(this._root);

  private _models = mapModels({
    source: getter(() => this.root?.models ?? []),
    target: (model) => model,
  });

  readonly models = $derived(this._models.content);

  async load() {
    this._root = await parse(this.options.string);
    await this._models.load((model) => model.load());
  }

  subscribe() {
    return $effect.root(() => {
      $effect(() => {
        this.load();
      });
    });
  }

  readonly isLoaded = $derived(!!this._root && isLoaded(this.models));
  readonly dependencies = [this._models];
}

export const markdown = (opts: OptionsInput<MarkdownModelOptions>) => {
  return new MarkdownModel(opts);
};
