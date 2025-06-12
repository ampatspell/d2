import type { PageLoad } from './$types';
import { toTree } from './models.svelte';

export const load: PageLoad = async () => {
  const input = '# Hello\n\nworld <weirdo label="hey there!">some inner text</weirdo> a bit more afterwards';
  return {
    input,
    root: await toTree(input),
  };
};
