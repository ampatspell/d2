import { preload } from '$d2/lib/base/refactoring/preload.svelte.js';

export const load = async (event) => {
  const { nodes } = await event.parent();
  const id = event.params.id;
  const node = nodes.byId(id);
  const details = node?.details;
  return {
    node,
    details: details && (await preload(details)),
  };
};
