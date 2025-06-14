import { MarkdownElementModel } from '$d2/lib/markdown/element.svelte';

export class LinkMarkdownModel extends MarkdownElementModel {
  readonly href = $derived(this.node.attributes.href);
}
