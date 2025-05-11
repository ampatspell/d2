import { app } from '$d2/lib/definition/utils.svelte';
import { file } from './file/definition.svelte';
import { missing } from './missing/definition.svelte';

export const definition = app({
  nodes: [missing(), file()],
});
