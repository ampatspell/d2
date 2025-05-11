import { node } from '$d2/lib/definition/utils.svelte';
import Backend from './backend.svelte';
import { BlankNodeDocumentModel } from './node.svelte';

export type BlankNodeProperties = {
  title: string;
};

export const blank = () => {
  return node('blank', {
    name: 'Blank',
    node: BlankNodeDocumentModel,
    defaults: () => ({
      title: 'blank',
    }),
    backend: Backend,
  });
};
