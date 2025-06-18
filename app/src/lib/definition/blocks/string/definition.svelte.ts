import { block } from '$d2/lib/definition/utils.svelte';
import { StringBlockModel } from './block.svelte';

export type StringBlockProperties = {
  content: string;
};

export const string = () => {
  return block('string', {
    name: 'String',
    model: StringBlockModel,
    defaults: () => ({ content: 'Hey there' }),
  });
};
