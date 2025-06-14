import { markdown } from '$d2/lib/definition/utils.svelte';
import Component from './component.svelte';
import { BoxMarkdownModel } from './model.svelte';

export const box = () => {
  return markdown('box', {
    model: BoxMarkdownModel,
    component: Component,
  });
};
