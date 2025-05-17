<script lang="ts">
  import type { Snippet } from 'svelte';
  import { DraggableModel, getDraggableContext } from './models.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import { fade } from 'svelte/transition';

  let {
    model,
    children,
    dragging,
  }: {
    model: unknown;
    children: Snippet;
    dragging: Snippet;
  } = $props();

  let context = getDraggableContext();
  let element = $state<HTMLDivElement>();
  let draggable = new DraggableModel({
    context: getter(() => context),
    element: getter(() => element),
    model: getter(() => model),
  });

  $effect(() => context.register(draggable));

  let onmousedown = (e: MouseEvent) => draggable.onMouseDown(e);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="draggable" bind:this={element} {onmousedown}>
  {@render children()}

  {#if draggable.dragging}
    <div
      class="dragging"
      transition:fade={{ duration: 100 }}
      style:--x="{draggable.dragging.point.x}px"
      style:--y="{draggable.dragging.point.y}px"
    >
      {@render dragging()}
    </div>
  {/if}
</div>

<style lang="scss">
  @use 'sass:color';
  .draggable {
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
