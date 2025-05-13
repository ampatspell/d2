<script lang="ts">
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import { isTruthy } from '$d2/lib/base/utils/array';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  $effect(() => subscribe(data.node));

  let gallery = $derived(data.node.node);
  let title = $derived(gallery?.title);
  let images = $derived(gallery?.images.map((file) => file.asImage).filter(isTruthy));
</script>

{#if title && images}
  <div class="page">
    <div class="title">{title}</div>
    <div class="images">
      {#each images as image (image)}
        {@const thumbnail = image.thumbnails['400x400']}
        <!-- svelte-ignore a11y_missing_attribute -->
        <img
          class="image"
          src={thumbnail.url}
          style:--width="{thumbnail.dimensions.width}px"
          style:--height="{thumbnail.dimensions.height}px"
        />
      {/each}
    </div>
  </div>
{:else}
  <div class="page">
    <div class="title">Missing</div>
  </div>
{/if}

<style lang="scss">
  .page {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    > .title {
      font-size: 21px;
    }
    > .images {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 15px;
      > .image {
        width: var(--width);
        height: var(--height);
      }
    }
  }
</style>
