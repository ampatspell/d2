import type { Component } from 'svelte';
import type { MarkdownElementModel, MarkdownElementModelOptions } from '../markdown/element.svelte';
import { Model } from '../base/model/base.svelte';

export type MarkdownElementDefinitionModelOptions<Model extends MarkdownElementModel> = {
  type: string;
  model: new (...args: ConstructorParameters<typeof MarkdownElementModel>) => Model;
  component: Component<{ model: Model }>;
};

export class MarkdownElementDefinitionModel<Model extends MarkdownElementModel = MarkdownElementModel> extends Model<
  MarkdownElementDefinitionModelOptions<Model>
> {
  readonly type = $derived(this.options.type);
  readonly component = $derived(this.options.component);

  model(opts: Omit<MarkdownElementModelOptions, 'definition'>) {
    return new this.options.model({
      definition: this,
      ...opts,
    });
  }
}
