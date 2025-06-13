import { Subscribable } from '../base/model/model.svelte';
import type { HasSubscriber } from '../base/model/subscriber.svelte';
import { serialized } from '../base/utils/object';
import type { MarkdownElementDefinitionModel } from '../definition/markdown.svelte';

export type MarkdownElementModelOptions = {
  definition: MarkdownElementDefinitionModel;
};

export class MarkdownElementModel extends Subscribable<MarkdownElementModelOptions> {
  readonly definition = $derived(this.options.definition);
  readonly type = $derived(this.definition.type);

  readonly isLoaded = true;

  get dependencies(): HasSubscriber[] {
    return [];
  }

  readonly serialized = $derived(serialized(this, ['type']));
}
