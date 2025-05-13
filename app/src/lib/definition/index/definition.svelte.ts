import { node } from '$d2/lib/definition/utils.svelte';
import Backend from './backend.svelte';
import { IndexNodeModel } from './node.svelte';

export type IndexNodeProperties = {
  title: string;
  background?: string;
};

export const index = () => {
  return node('index', {
    name: 'Index',
    node: IndexNodeModel,
    defaults: () => ({
      title: 'maybe',
      background: '',
    }),
    backend: Backend,
  });
};
