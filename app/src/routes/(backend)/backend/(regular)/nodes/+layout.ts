import { preload } from '$d2/lib/base/refactoring/preload.svelte';
import { NodesModel } from '$d2/lib/nodes/nodes.svelte';
import { NodesSettingsModel } from '$d2/lib/nodes/user.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  return {
    nodes: await preload(NodesModel.allNodes()),
    settings: await preload(NodesSettingsModel.forCurrentUser()),
  };
};
