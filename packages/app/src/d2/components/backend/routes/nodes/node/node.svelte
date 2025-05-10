<script lang="ts">
  import MasterDetail from '$d2/components/backend/nodes/node/master-detail/master-detail.svelte';
  import Delete from '$d2/components/dark/section/page/delete.svelte';
  import Page from '$d2/components/dark/section/page/page.svelte';
  import Placeholder from '$d2/components/dark/section/placeholder.svelte';
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import type { NodeDocumentModelLoader } from '$d2/lib/nodes/node.svelte';

  let { loader, onWillDelete }: { loader: NodeDocumentModelLoader; onWillDelete: VoidCallback } = $props();

  let node = $derived(loader.node);
  let title = $derived(node?.identifier);

  let onDelete = async () => {
    onWillDelete();
    await node!.delete();
  };
</script>

{#if node}
  <Page {title}>
    {#snippet actions()}
      <Delete name="node" {onDelete} />
    {/snippet}
    <MasterDetail {node} />
  </Page>
{:else}
  <Placeholder label="Node not found" />
{/if}
