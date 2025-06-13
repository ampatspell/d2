import { Model } from '../base/model/model.svelte';
import type { MarkdownElementModel, MarkdownElementModelOptions } from '../markdown/element.svelte';

export type MarkdownElementDefinitionModelOptions = {
  type: string;
  model: new (...args: ConstructorParameters<typeof MarkdownElementModel>) => MarkdownElementModel;
};

export class MarkdownElementDefinitionModel extends Model<MarkdownElementDefinitionModelOptions> {
  readonly type = $derived(this.options.type);

  model(opts: Omit<MarkdownElementModelOptions, 'definition'>) {
    return new this.options.model({
      definition: this,
      ...opts,
    });
  }
}
