<script lang="ts">
  import Grid, { type GridOptions } from '$d2/components/frontend/galleries/grid/grid.svelte';
  import Lightbox, { type LightboxOptions } from '$d2/components/frontend/galleries/lightbox/lightbox.svelte';
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import { aspectRatio } from '$d2/lib/base/utils/aspect-ratio';
  import { getter, options } from '$d2/lib/base/utils/options';
  import { FileNodeModel } from '$d2/lib/definition/file/node.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  $effect(() => subscribe(data.loader));

  let gallery = $derived(data.loader.node);
  let title = $derived(gallery?.title);
  let introduction = $derived(gallery?.introduction);
  let files = $derived(gallery?.details.images);

  let selected = $state<FileNodeModel>();
  let onSelect = (node: FileNodeModel) => {
    selected = node;
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  let innerHeight = $state<number>();
  let innerWidth = $state<number>(Infinity);
  let isMobile = $derived(innerWidth <= 768);

  let height = $derived.by(() => {
    if (innerHeight) {
      let base = innerHeight - 130;
      if (isMobile) {
        return base + 20;
      }
      return base;
    }
  });

  let horizontalPadding = $derived(isMobile ? 15 : 30);

  let lightboxOptions: LightboxOptions = options({
    horizontalPadding: getter(() => horizontalPadding),
    height: getter(() => height),
    thumbnail: '2048x2048',
  });

  let gridOptions: GridOptions = options({
    gap: 15,
    thumbnail: '400x400',
    alignment: 'center',
    aspectRatio: aspectRatio('3x2'),
  });

  let ogImage = $derived(files?.[0]?.asImage?.thumbnails['2048x2048'].url);

  let isLoaded = $state(false);
  $effect(() => {
    selected = files?.[0];
    isLoaded = true;
  });
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<svelte:head>
  <meta content={title} property="og:title" />
  <meta content={introduction} property="og:description" />
  <meta content={ogImage} property="og:image" />
</svelte:head>

<div class="page" class:loaded={isLoaded}>
  {#if files}
    <div class="lightbox">
      <Lightbox {files} {selected} {onSelect} options={lightboxOptions} />
    </div>
    <div class="details">
      <div class="caption">
        <div class="title">{title}</div>
        {#if introduction}
          <div class="introduction">{introduction}</div>
        {/if}
      </div>
      <Grid {files} {onSelect} options={gridOptions} />
    </div>
  {/if}
</div>

<style lang="scss">
  .page {
    visibility: hidden;
    &.loaded {
      visibility: visible;
    }
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 30px 0 0 0;
    @media (max-width: 768px) {
      padding: 15px 0 0 0;
    }
    > .lightbox {
      display: flex;
      flex-direction: column;
    }
    > .details {
      display: flex;
      flex-direction: column;
      gap: 30px;
      border-top: 1px solid #eee;
      padding: 30px;
      @media (max-width: 768px) {
        padding: 15px;
      }
      > .caption {
        display: flex;
        flex-direction: row;
        gap: 20px;
        > .title {
          font-weight: 600;
        }
        @media (max-width: 768px) {
          flex-direction: column;
          gap: 5px;
        }
      }
    }
  }
</style>
