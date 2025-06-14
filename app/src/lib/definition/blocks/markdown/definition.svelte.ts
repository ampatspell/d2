import { block } from '$d2/lib/definition/utils.svelte';
import { MarkdownBlockModel } from './block.svelte';

export type MarkdownBlockProperties = {
  content: string;
};

export const markdown = () => {
  return block('markdown', {
    name: 'Markdown',
    model: MarkdownBlockModel,
    defaults: () => ({ content: 'Hey there' }),
  });
};
