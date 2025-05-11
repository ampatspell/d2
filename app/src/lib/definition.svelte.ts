import { file } from '$d2/lib/definition/file/definition.svelte';
import { app } from '$d2/lib/definition/utils.svelte';
import { blank } from './blank/definition.svelte';

export const definition = app({
  nodes: [file(), blank()],
});
