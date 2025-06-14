import type { HasPosition } from '$d2/lib/base/utils/types';
import { node } from '$d2/lib/definition/utils.svelte';
import type { BlockProperty } from '$d2/lib/nodes/node/node.svelte';
import Backend from './backend.svelte';
import { IndexNodeModel } from './node.svelte';

export type IndexNodeLink = HasPosition & {
  label: string;
  path: string;
};

export type IndexNodeProperties = {
  title: string;
  background?: string;
  links?: IndexNodeLink[];
  introduction?: BlockProperty<'markdown'>;
};

export const index = () => {
  return node('index', {
    name: 'Index',
    model: IndexNodeModel,
    defaults: () => ({
      title: 'maybe',
      background: '',
    }),
    backend: Backend,
  });
};
