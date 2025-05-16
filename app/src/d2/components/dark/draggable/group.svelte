<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createDraggableContext } from './models.svelte';
  import { getter } from '$d2/lib/base/utils/options';

  let { isDraggable, children }: { isDraggable: boolean; children: Snippet } = $props();

  let context = createDraggableContext({
    isDraggable: getter(() => isDraggable),
  });

  let onmousemove = (e: MouseEvent) => context.onMouseMove(e);
  let onmouseup = (e: MouseEvent) => context.onMouseUp(e);
</script>

<svelte:window {onmousemove} {onmouseup} />

<div class="group">
  {@render children()}
</div>

<style lang="scss">
  .group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
