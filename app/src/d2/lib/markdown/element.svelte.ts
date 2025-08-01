import { SubscribableModel } from '../base/refactoring/subscribable.svelte';
import { serialized } from '../base/utils/object';
import type { MarkdownElementDefinitionModel } from '../definition/markdown.svelte';
import type { MarkdownElement } from './tree';

export type MarkdownElementModelOptions = {
  definition: MarkdownElementDefinitionModel;
  node: MarkdownElement;
};

export class MarkdownElementModel extends SubscribableModel<MarkdownElementModelOptions> {
  readonly definition = $derived(this.options.definition);
  readonly type = $derived(this.definition.type);
  readonly component = $derived(this.definition.component);

  readonly node = $derived(this.options.node);
  readonly attributes = $derived(this.node.attributes);
  readonly children = $derived(this.node.children);

  readonly isLoaded = true;

  async load() {}

  readonly dependencies = [];
  readonly serialized = $derived(serialized(this, ['type']));
}
