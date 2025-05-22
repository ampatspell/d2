import { node } from '$d2/lib/nodes/loader.svelte';

export const load = async (event) => {
  const id = event.params.id;
  return {
    loader: await node.forId({ id }).preload(),
  };
};
