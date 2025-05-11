import { node } from '$d2/lib/nodes/loader.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  return {
    node: await node.forId(event.params.id).preload(),
  };
};
