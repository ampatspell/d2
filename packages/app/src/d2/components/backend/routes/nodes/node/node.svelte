<script lang="ts">
  import Delete from '$d2/components/dark/section/page/delete.svelte';
  import MasterDetail from '$d2/components/dark/section/page/master-detail.svelte';
  import Page from '$d2/components/dark/section/page/page.svelte';
  import Placeholder from '$d2/components/dark/section/placeholder.svelte';
  import type { NodeDocumentModelLoader } from '$d2/lib/nodes/node.svelte';

  let { loader }: { loader: NodeDocumentModelLoader } = $props();

  let node = $derived(loader.node);
  let definition = $derived(node?.definition);

  let title = $derived(node?.kind);

  let onDelete = async () => {};
</script>

{#if node}
  <Page {title}>
    {#snippet actions()}
      <Delete name="node" {onDelete} />
    {/snippet}
    {#if definition}
      <MasterDetail>
        {#snippet master()}
          <definition.backend {node} />
        {/snippet}
        {#snippet detail()}{/snippet}
      </MasterDetail>
    {:else}
      <Placeholder label="Node definition missing" />
    {/if}
  </Page>
{:else}
  <Placeholder label="Node not found" />
{/if}
