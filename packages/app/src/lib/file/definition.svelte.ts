import { node } from '$d2/lib/definition/utils.svelte';
import Backend from './backend.svelte';
import { FileNodeDocumentModel } from './node.svelte';

export const file = () => {
  return node('file', {
    defaults: () => undefined,
    node: FileNodeDocumentModel,
    backend: Backend,
  });
};
