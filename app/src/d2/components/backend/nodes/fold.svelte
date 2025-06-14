<script lang="ts">
  import Fold from '$d2/components/dark/section/page/fold.svelte';
  import type { NodesSettingsModel } from '$d2/lib/nodes/user.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { NodeModel } from '$d2/lib/nodes/node/node.svelte';

  let {
    nodes,
    settings,
    onSelect,
  }: {
    nodes: NodesModel;
    settings: NodesSettingsModel;
    onSelect: (model: NodeModel | undefined) => void;
  } = $props();

  let models = $derived(nodes.byParentId(null));
  let fold = $derived(settings.fold);

  let onFold = (open: boolean) => {
    if (!open) {
      onSelect(undefined);
    }
    settings.setOpenAll(open);
  };
</script>

{#if models.length > 0}
  <Fold {fold} {onFold} />
{/if}
