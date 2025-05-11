<script lang="ts">
  import { goto } from '$app/navigation';
  import Node from '$d2/components/backend/routes/nodes/node/node.svelte';
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let nodes = $derived(data.nodes);

  let loader = $derived(data.node);
  $effect(() => subscribe(data.node));

  let onWillDelete = () => {
    let parent = loader.node?.parent?.id;
    if (parent) {
      goto(`/backend/nodes/${parent}`);
    } else {
      goto('/backend/nodes');
    }
  };
</script>

<Node {loader} {nodes} {onWillDelete} />
