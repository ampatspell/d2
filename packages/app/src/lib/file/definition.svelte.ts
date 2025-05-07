import { node } from '$d2/lib/definition/site.svelte';
import { FileNodeDocumentModel } from './node.svelte';

export const file = () =>
  node('file', {
    model: FileNodeDocumentModel,
    defaults: () => undefined,
  });
