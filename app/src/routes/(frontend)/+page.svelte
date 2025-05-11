<script lang="ts">
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
    import { IndexNodeDocumentModel } from '$lib/index/node.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let index = $derived(data.index);
  $effect(() => subscribe(index));

  let node = $derived(data.index.as(IndexNodeDocumentModel));
</script>

<div class="page">
  <div class="title">{node?.title}</div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    > .title {
      font-size: 21px;
      font-weight: 500;
      padding: 30px;
    }
  }
</style>
