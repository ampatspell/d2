<script lang="ts">
  import Grid from '$d2/components/backend/routes/nodes/node/grid/grid.svelte';
  import Placeholder from '$d2/components/dark/section/placeholder.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let node = $derived(data.node);
  let nodes = $derived(data.nodes);
</script>

{#if node}
  <Grid {node} {nodes} />
{:else}
  <Placeholder label="Node not found" />
{/if}
