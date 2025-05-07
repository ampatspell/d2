<script lang="ts">
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import { setGlobal } from '$d2/lib/base/utils/set-global';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let loader = $derived(data.node);
  $effect(() => subscribe(loader));

  let node = $derived(loader.node);
  $effect(() => setGlobal({ node }));
</script>

{node}
