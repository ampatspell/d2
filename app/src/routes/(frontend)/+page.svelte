<script lang="ts">
  import { subscribe } from '$d2/lib/base/refactoring/subscribable.svelte';
  import Index from '$lib/pages/index.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  $effect(() => subscribe(data.loader));

  let index = $derived(data.loader.node);
</script>

{#if index?.isLoaded}
  <Index {index} />
{/if}
