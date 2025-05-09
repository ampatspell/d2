import { node } from '$d2/lib/definition/utils.svelte';
import Backend from './backend.svelte';
import { FileNodeDocumentModel } from './node.svelte';

export const file = () => {
  return node('file', {
    node: FileNodeDocumentModel,
    defaults: undefined,
    backend: Backend,
  });
};
