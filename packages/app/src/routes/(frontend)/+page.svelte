<script lang="ts">
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import type { MissingNodeDocumentModel } from '$lib/missing/node.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let loader = $derived(data.loader);
  let node = $derived(loader.node as MissingNodeDocumentModel | undefined);

  $effect(() => subscribe(loader));
</script>

<div class="page">
  <div class="row">
    {node?.data.properties.message ?? `Node not found`}
  </div>
  <div class="row">
    <a href="/backend">backend</a>
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    justify-content: center;
    padding: 50px;
  }
</style>
