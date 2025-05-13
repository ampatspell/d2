<script lang="ts" module>
  import type { FileThumbnail } from '$d2-shared/nodes/file';
  import { nextObject, prevObject } from '$d2/lib/base/utils/array';
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import type { FileNodeModel } from '$d2/lib/definition/file/node.svelte';

  export type LightboxOptions = {
    thumbnail: FileThumbnail;
    height: number | undefined;
    horizontalPadding: number;
  };
</script>

<script lang="ts">
  import Image from './-image.svelte';
  import Overlay from './-overlay.svelte';

  let {
    files,
    selected,
    options,
    onSelect: _onSelect,
  }: {
    files: FileNodeModel[];
    selected: FileNodeModel | undefined;
    options: LightboxOptions;
    onSelect: (file: FileNodeModel) => void;
  } = $props();

  let height = $derived(options.height);
  let horizontalPadding = $derived(options.horizontalPadding);

  let cursor = $state(true);

  let onSelect = (file?: FileNodeModel) => {
    if (file) {
      _onSelect(file);
    }
  };

  let onPrevious = () => {
    onSelect(prevObject(files, selected, true));
  };

  let onNext = () => {
    onSelect(nextObject(files, selected, true));
  };

  let handlers: { [key: string]: VoidCallback } = {
    ArrowRight: () => onNext(),
    ArrowLeft: () => onPrevious(),
  };

  let onkeydown = (e: KeyboardEvent) => {
    let fn = handlers[e.key];
    if (fn) {
      fn();
      cursor = false;
    }
  };

  let onmousemove = () => (cursor = true);
</script>

<svelte:window {onkeydown} {onmousemove} />

{#if height}
  <div class="lightbox" style:--height="{height}px">
    <div class="images" style:--horizontal-padding="{horizontalPadding}px">
      {#each files as file (file)}
        <Image {file} {options} isSelected={file === selected} />
      {/each}
    </div>
    <Overlay {onPrevious} {onNext} isHidden={!cursor} />
  </div>
{/if}

<style lang="scss">
  .lightbox {
    position: relative;
    height: var(--height);
    > .images {
      position: absolute;
      top: 0;
      bottom: 0;
      left: var(--horizontal-padding);
      right: var(--horizontal-padding);
    }
  }
</style>
