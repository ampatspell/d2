<script lang="ts">
  import { goto } from '$app/navigation';
  import Node from '$d2/components/backend/routes/nodes/node/node.svelte';
  import Placeholder from '$d2/components/dark/section/placeholder.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let nodes = $derived(data.nodes);

  let node = $derived(data.node);

  let onWillDelete = () => {
    let parent = node?.parent?.id;
    if (parent) {
      goto(`/backend/nodes/${parent}`);
    } else {
      goto('/backend/nodes');
    }
  };
</script>

{#if node}
  <Node {node} {nodes} {onWillDelete} />
{:else}
  <Placeholder label="Node not found" />
{/if}
