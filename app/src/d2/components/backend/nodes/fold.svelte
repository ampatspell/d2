<script lang="ts">
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
  import Fold from '$d2/components/dark/section/page/fold.svelte';
  import type { NodesSettingsModel } from '$d2/lib/nodes/user.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';

  let {
    nodes,
    settings,
    onSelect,
  }: {
    nodes: NodesModel;
    settings: NodesSettingsModel;
    onSelect: (model: NodeDocumentModel | undefined) => void;
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
