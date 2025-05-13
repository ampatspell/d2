import { node } from '$d2/lib/nodes/loader.svelte';
import { BlankNodeModel } from '$lib/blank/node.svelte';

export const load = async () => {
  return {
    node: await node.forId('eZhmyQ61i3PbB4MSfkNC', BlankNodeModel).preload(),
  };
};
