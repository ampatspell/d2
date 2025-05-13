import { node } from '$d2/lib/definition/utils.svelte';
import Backend from './backend.svelte';
import { BlankNodeModel } from './node.svelte';

export type BlankNodeProperties = {
  title: string;
  background?: string;
};

export const blank = () => {
  return node('blank', {
    name: 'Blank',
    node: BlankNodeModel,
    defaults: () => ({
      title: 'blank',
    }),
    backend: Backend,
  });
};
