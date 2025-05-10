import { preloadModel } from '$d2/lib/base/fire/preload.svelte';
import { NodesModel } from '$d2/lib/nodes/nodes.svelte';
import { NodesSettingsModel } from '$d2/lib/nodes/user.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
  const id = event.params.id;
  return {
    id,
    nodes: await preloadModel(NodesModel.all()),
    settings: await preloadModel(NodesSettingsModel.forCurrentUser()),
  };
};
