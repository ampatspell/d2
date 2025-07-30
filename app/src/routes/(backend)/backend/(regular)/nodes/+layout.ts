import { preloadModel } from '$d2/lib/base/fire/preload.svelte';
import { NodesModel } from '$d2/lib/nodes/nodes.svelte';
import { NodesSettingsModel } from '$d2/lib/nodes/user.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  return {
    nodes: await preloadModel(NodesModel.allNodes()),
    settings: await preloadModel(NodesSettingsModel.forCurrentUser()),
  };
};
