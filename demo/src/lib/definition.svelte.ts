import { file } from '$d2/lib/definition/file/definition.svelte';
import { app } from '$d2/lib/definition/utils.svelte';
import { index } from './index/definition.svelte';

export const definition = app({
  nodes: [index(), file()],
});
