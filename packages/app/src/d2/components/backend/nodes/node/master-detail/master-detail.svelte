<script lang="ts">
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
  import MasterDetail from '$d2/components/dark/section/page/master-detail.svelte';
  import Sidebar from './sidebar.svelte';
  import Placeholder from '$d2/components/dark/section/placeholder.svelte';
  import Master from './master.svelte';

  let { node }: { node: NodeDocumentModel } = $props();
  let definition = $derived(node?.definition);
</script>

{#if definition}
  <MasterDetail>
    {#snippet master()}
      <Master {node} {definition} />
    {/snippet}
    {#snippet detail()}
      <Sidebar {node} />
    {/snippet}
  </MasterDetail>
{:else}
  <Placeholder label="Node definition missing" />
{/if}
