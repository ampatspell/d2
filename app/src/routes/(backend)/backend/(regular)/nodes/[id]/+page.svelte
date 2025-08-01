<script lang="ts">
  import Node from '$d2/components/backend/routes/nodes/node/node.svelte';
  import Placeholder from '$d2/components/dark/section/placeholder.svelte';
  import { subscribe } from '$d2/lib/base/refactoring/subscribable.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let nodes = $derived(data.nodes);
  let node = $derived(data.node);
  let details = $derived(data.details);

  $effect(() => subscribe(node));
  $effect(() => subscribe(details));
</script>

{#if node}
  <Node {node} {nodes} />
{:else}
  <Placeholder label="Node not found" />
{/if}
