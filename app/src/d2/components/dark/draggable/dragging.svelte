<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { DraggableModel } from './models.svelte';
  import type { Snippet } from 'svelte';

  let {
    draggable,
    children,
  }: {
    draggable: DraggableModel;
    children: Snippet;
  } = $props();
</script>

{#if draggable.dragging}
  {@const point = draggable.dragging.point}
  <div class="dragging" transition:fade={{ duration: 100 }} style:--x="{point.x}px" style:--y="{point.y}px">
    {@render children()}
  </div>
{/if}

<style lang="scss">
  @use 'sass:color';
  .dragging {
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    transform: translate(var(--x), var(--y));
    border-radius: 4px;
    background: #fff;
    box-shadow:
      0 5px 10px color.adjust(#000, $alpha: -0.95),
      0 20px 40px color.adjust(#000, $alpha: -0.95);
  }
</style>
