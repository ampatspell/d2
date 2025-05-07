import { node } from '$d2/lib/definition/site.svelte';
import { MissingNodeDocumentModel } from '$lib/missing/node.svelte';

export const missing = () =>
  node('missing', {
    model: MissingNodeDocumentModel,
    defaults: () => ({
      message: '404 page not found',
    }),
  });
