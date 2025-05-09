<script lang="ts">
    import { goto } from '$app/navigation';
  import Node from '$d2/components/backend/routes/nodes/node/node.svelte';
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let loader = $derived(data.node);
  $effect(() => subscribe(loader));

  let onWillDelete = () => {
    goto('/backend/nodes');
  }
</script>

<Node {loader} {onWillDelete} />
