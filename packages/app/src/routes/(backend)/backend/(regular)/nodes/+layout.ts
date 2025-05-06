import { preloadModel } from "$d2/lib/base/fire/preload.svelte";
import { NodesModel } from "$d2/lib/nodes/nodes.svelte";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async (event) => {
  const id = event.params.id;
  const nodes = NodesModel.all();
  return {
    id,
    nodes: await preloadModel(nodes),
  };
}
