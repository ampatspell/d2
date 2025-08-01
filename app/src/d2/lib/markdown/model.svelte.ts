import { isLoaded } from '../base/fire/is-loaded.svelte';
import { mapModels } from '../base/refactoring/fire/models.svelte';
import { SubscribableModel } from '../base/refactoring/subscribable.svelte';
import { getter, type OptionsInput } from '../base/utils/options';
import { parse, type MarkdownRoot } from './tree';

export type MarkdownModelOptions = {
  string: string | undefined;
};

export class MarkdownModel extends SubscribableModel<MarkdownModelOptions> {
  private _root = $state<MarkdownRoot>();

  get root() {
    return this._subscribe(() => this._root);
  }

  private _models = mapModels({
    source: getter(() => this.root?.models ?? []),
    target: (model) => model,
  });

  readonly models = $derived(this._models.content);

  readonly _string = $derived(this.options.string);

  get string() {
    return this._subscribe(() => this._string);
  }

  async load() {
    const string = this._string;
    const root = await parse(string);
    if (this.string === string) {
      this._root = root;
    }
    await this._models.load((model) => model.load());
  }

  subscribe() {
    $effect(() => {
      this.load();
    });
  }

  readonly isLoaded = $derived.by(() => {
    console.log('activation', this['_subscribable']['_activations']);
    return !!this.root && isLoaded(this.models);
  });

  readonly dependencies = [this._models];
}

export const markdown = (opts: OptionsInput<MarkdownModelOptions>) => {
  return new MarkdownModel(opts);
};
