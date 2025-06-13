import { Subscribable } from '../base/model/model.svelte';
import type { HasSubscriber } from '../base/model/subscriber.svelte';
import { serialized } from '../base/utils/object';
import type { MarkdownElementDefinitionModel } from '../definition/markdown.svelte';
import type { MarkdownElement } from './tree';

export type MarkdownElementModelOptions = {
  definition: MarkdownElementDefinitionModel;
  node: MarkdownElement;
};

export class MarkdownElementModel extends Subscribable<MarkdownElementModelOptions> {
  readonly definition = $derived(this.options.definition);
  readonly type = $derived(this.definition.type);
  readonly component = $derived(this.definition.component);

  readonly node = $derived(this.options.node);
  readonly attributes = $derived(this.node.attributes);
  readonly children = $derived(this.node.children);

  readonly isLoaded = true;

  async load() {}

  get dependencies(): HasSubscriber[] {
    return [];
  }

  readonly serialized = $derived(serialized(this, ['type']));
}
