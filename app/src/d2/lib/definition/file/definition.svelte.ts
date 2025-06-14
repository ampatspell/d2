import { node } from '$d2/lib/definition/utils.svelte';
import Backend from './backend.svelte';
import { FileNodeModel } from './node.svelte';

export const file = () => {
  return node('file', {
    name: 'File',
    model: FileNodeModel,
    defaults: undefined,
    backend: Backend,
  });
};
