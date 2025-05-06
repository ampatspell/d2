<script lang="ts">
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let loader = $derived(data.node);
  $effect(() => subscribe(loader));

  let node = $derived(loader.node);
</script>

{node}
