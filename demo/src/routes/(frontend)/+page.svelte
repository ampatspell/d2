<script lang="ts">
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import Index from '../../pages/index.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  $effect(() => subscribe(data.index));

  let index = $derived(data.index.node);
</script>

{#if index}
  <Index {index} />
{/if}
