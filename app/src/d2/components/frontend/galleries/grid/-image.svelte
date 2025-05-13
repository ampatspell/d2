<script lang="ts">
  import { classes } from '$d2/lib/base/utils/classes';
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import type { FileNodeModel } from '$d2/lib/definition/file/node.svelte';
  import type { GridOptions } from './grid.svelte';

  let {
    file,
    options,
    onClick,
  }: {
    file: FileNodeModel;
    options: GridOptions;
    onClick: VoidCallback;
  } = $props();

  let alignment = $derived(options.alignment);
  let url = $derived(file.asImage?.thumbnails[options.thumbnail].url);
  let onclick = () => onClick();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={classes('image', `alignment-${alignment}`)} {onclick}>
  <div class="content" style:--url="url('{url}')"></div>
</div>

<style lang="scss">
  .image {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    transition: 0.15s ease-in-out opacity;
    width: var(--width);
    > .content {
      background-repeat: no-repeat;
      background-size: contain;
      background-image: var(--url);
      height: var(--height);
    }
    &:hover {
      opacity: 0.8;
    }
    &.alignment-center {
      > .content {
        background-position: center center;
      }
    }
    &.alignment-bottom-left {
      > .content {
        background-position: bottom left;
      }
    }
    &.alignment-bottom-center {
      > .content {
        background-position: bottom center;
      }
    }
  }
</style>
