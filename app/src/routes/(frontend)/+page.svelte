<script lang="ts">
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  $effect(() => subscribe(data.index));
  $effect(() => subscribe(data.images));

  let index = $derived(data.index.node);
  let images = $derived(data.images.nodes.filter((node) => node.isImage));
</script>

<div class="page">
  <div class="title">{index?.title}</div>
  <div class="images">
    {#each images as image (image)}
      {#if image.thumbnails}
        <!-- svelte-ignore a11y_missing_attribute -->
        <img src={image.thumbnails['400x400'].url} />
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    > .title {
      font-size: 21px;
      font-weight: 500;
    }
    > .images {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 15px;
    }
  }
</style>
