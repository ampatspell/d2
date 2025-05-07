import { node } from '$d2/lib/definition/utils.svelte';
import { MissingNodeDocumentModel } from '$lib/missing/node.svelte';

export const missing = () => {
  return node('missing', {
    model: MissingNodeDocumentModel,
    defaults: () => ({
      message: '404 page not found',
    }),
  });
};
