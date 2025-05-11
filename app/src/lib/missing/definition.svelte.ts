import { node } from '$d2/lib/definition/utils.svelte';
import { MissingNodeDocumentModel } from '$lib/missing/node.svelte';
import Backend from './backend.svelte';

export type MissingNodeProperties = {
  message?: string;
};

export const missing = () => {
  return node('missing', {
    name: 'Missing',
    node: MissingNodeDocumentModel,
    defaults: () => ({
      message: '404 page not found',
    }),
    backend: Backend,
  });
};
