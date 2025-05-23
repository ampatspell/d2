import { preloadModel } from '$d2/lib/base/fire/preload.svelte.js';

export const load = async (event) => {
  const { nodes } = await event.parent();
  const id = event.params.id;
  const node = nodes.byId(id);
  const details = node?.details;
  return {
    node,
    details: details && (await preloadModel(details)),
  };
};
