import { app } from '$d2/lib/definition/utils.svelte';
import { file } from './file/definition.svelte';
import { index } from './index/definition.svelte';

export const definition = app({
  nodes: [index(), file()],
});
