import { markdown } from '$d2/lib/definition/utils.svelte';
import { MarkdownElementModel } from '$d2/lib/markdown/element.svelte';

export class LinkMarkdownModel extends MarkdownElementModel {}

export const link = () => {
  return markdown('a', {
    model: LinkMarkdownModel,
  });
};
