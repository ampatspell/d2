<script lang="ts">
  import type { Dimensions } from '$d2-shared/nodes/file';
  import { fit } from '$d2/lib/base/utils/number';
  import type { FileNodeModel } from '$d2/lib/definition/file/node.svelte';
  import type { LightboxOptions } from './lightbox.svelte';

  let {
    file,
    isSelected,
    options,
  }: {
    file: FileNodeModel;
    isSelected: boolean;
    options: LightboxOptions;
  } = $props();

  let thumbnail = $derived(file.asImage?.thumbnails[options.thumbnail]);
  let url = $derived(thumbnail?.url);

  let content = $state<Dimensions>({ width: 0, height: 0 });
  let size = $derived.by(() => {
    if (thumbnail) {
      let { width, height } = content;
      let image = {
        width,
        height,
      };
      return fit(image, thumbnail.dimensions);
    }
  });
</script>

{#if size}
  <div
    class="image"
    class:selected={isSelected}
    bind:clientWidth={content.width}
    bind:clientHeight={content.height}
    style:--url="url('{url}')"
    style:--width="{size.width}px"
    style:--height="{size.height}px"
  >
    <div class="column">
      <div class="content"></div>
    </div>
  </div>
{/if}

<style lang="scss">
  .image {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: 0.15s ease-in-out opacity;
    > .column {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: var(--width);
      gap: 10px;
      > .content {
        width: var(--width);
        height: var(--height);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
        background-image: var(--url);
      }
    }
    pointer-events: none;
    &.selected {
      opacity: 1;
      pointer-events: auto;
    }
  }
</style>
