<script lang="ts">
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import { isTruthy } from '$d2/lib/base/utils/array';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  $effect(() => subscribe(data.index));
  $effect(() => subscribe(data.images));

  let index = $derived(data.index.node);
  let images = $derived(data.images.nodes.map((node) => node.asImage).filter(isTruthy));
</script>

<div class="page">
  <div class="title">{index?.title}</div>
  <div class="images">
    {#each images as image (image)}
      {@const thumbnail = image.thumbnails['400x400']}
      <!-- svelte-ignore a11y_missing_attribute -->
      <img
        src={thumbnail.url}
        style:--width="{thumbnail.dimensions.width}px"
        style:--height="{thumbnail.dimensions.height}px"
      />
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
      > img {
        width: var(--width);
        height: var(--height);
      }
    }
  }
</style>
