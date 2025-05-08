<script lang="ts">
  import Placeholder from '$d2/components/dark/section/placeholder.svelte';
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let loader = $derived(data.node);
  $effect(() => subscribe(loader));

  let node = $derived(loader.node);
  let definition = $derived(node.definition);
</script>

{#if definition}
  <definition.backend {node} />
{:else}
  <Placeholder label="Node definition missing" />
{/if}
