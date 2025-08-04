<script lang="ts">
  import { subscribe } from '$d2/lib/base/model/subscribable.svelte';
  import Index from '$lib/pages/index.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let loader = $derived(data.loader);

  $effect(() => subscribe(loader));

  let index = $derived(loader.node);
</script>

{#if index?.isLoaded}
  <Index {index} />
{/if}
