import { node } from '$d2/lib/definition/utils.svelte';
import Backend from './backend.svelte';
import { UnknownNodeModel } from './node.svelte';

export const unknown = () => {
  return node(undefined, {
    name: 'Unknown',
    model: UnknownNodeModel,
    defaults: undefined,
    backend: Backend,
  });
};
