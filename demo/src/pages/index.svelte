<script lang="ts">
  import type { IndexNodeModel } from '$lib/index/node.svelte';

  let { index }: { index: IndexNodeModel } = $props();

  let background = $derived(index.background.node?.asImage);
  let url = $derived(background?.thumbnails['2048x2048'].url);
</script>

<div class="page">
  {#if url}
    <div class="image" style:--url="url({url})"></div>
  {/if}
  <div class="title">{index?.title}</div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    > .image {
      position: fixed;
      z-index: -1;
      $o: -50px;
      top: $o;
      left: $o;
      bottom: $o;
      right: $o;
      background-color: #222;
      background-position: center center;
      background-repeat: no-repeat;
      background-image: var(--url);
      background-size: cover;
    }
    > .title {
      font-size: 21px;
      font-weight: 500;
      color: #fff;
    }
  }
</style>
