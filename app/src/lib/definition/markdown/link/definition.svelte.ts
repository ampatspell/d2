import { markdown } from '$d2/lib/definition/utils.svelte';
import Component from './component.svelte';
import { LinkMarkdownModel } from './model.svelte';

export const link = () => {
  return markdown('a', {
    model: LinkMarkdownModel,
    component: Component,
  });
};
