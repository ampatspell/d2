<script lang="ts">
  import Node from '$d2/components/backend/routes/nodes/node/node.svelte';
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let loader = $derived(data.node);
  $effect(() => subscribe(loader));
</script>

<Node {loader} />
