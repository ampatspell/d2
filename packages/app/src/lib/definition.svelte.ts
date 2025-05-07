import { type SiteDefinitionModelOptions } from '$d2/lib/definition/site.svelte';
import { file } from './file/definition.svelte';
import { missing } from './missing/definition.svelte';

export const definition = (): SiteDefinitionModelOptions => {
  return {
    nodes: [missing(), file()],
  };
};
