<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getDraggableContext } from './draggable-array.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import { DraggableState } from './models.svelte';

  let {
    model,
    children,
  }: {
    model: unknown;
    children: Snippet<[{ type: 'regular' | 'dragging' | 'overlay' }]>;
  } = $props();

  let context = getDraggableContext();
  let draggable = $state<DraggableState>();
  let element = $state<HTMLDivElement>();

  let onmousedown = (e: MouseEvent) => {
    e.preventDefault();
    draggable = new DraggableState({
      element: getter(() => element),
    });
    draggable.onMouseDown(e);
  };

  let onmousemove = (e: MouseEvent) => {
    if (draggable) {
      e.preventDefault();
      draggable.onMouseMove(e);
    }
  };

  let onmouseup = (e: MouseEvent) => {
    if (draggable) {
      e.preventDefault();
      draggable.onMouseUp();
      draggable = undefined;
    }
  };
</script>

<svelte:window {onmousemove} {onmouseup} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="draggable-model" bind:this={element} {onmousedown}>
  {@render children({ type: draggable?.isDragging ? 'dragging' : 'regular' })}
  {#if draggable?.isDragging}
    <div class="dragging" style:--x="{draggable.dragging.x}px" style:--y="{draggable.dragging.y}px">
      {@render children({ type: 'overlay' })}
    </div>
  {/if}
</div>

<style lang="scss">
  @use 'sass:color';
  .draggable-model {
    position: relative;
    > .dragging {
      z-index: 1;
      position: fixed;
      top: 0;
      left: 0;
      transform: translate(var(--x), var(--y));
      background: #fff;
      box-shadow:
        0 5px 10px color.adjust(#000, $alpha: -0.95),
        0 20px 40px color.adjust(#000, $alpha: -0.95);
    }
  }
</style>
