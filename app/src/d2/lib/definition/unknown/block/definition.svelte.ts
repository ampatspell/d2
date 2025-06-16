import { block } from '../../utils.svelte';
import { UnknownBlockModel } from './block.svelte';

export const unknown = () => {
  return block(undefined, {
    name: 'Unknown',
    model: UnknownBlockModel,
    defaults: undefined,
  });
};
