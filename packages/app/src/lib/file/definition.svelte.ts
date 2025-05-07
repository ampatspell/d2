import { node } from '$d2/lib/definition/utils.svelte';
import { FileNodeDocumentModel } from './node.svelte';

export const file = () => {
  return node('file', {
    model: FileNodeDocumentModel,
    defaults: () => undefined,
  });
};
