<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createDraggableContext, type DraggableDelegate } from './models.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import { fade } from 'svelte/transition';

  let { delegate, children }: { delegate: DraggableDelegate; children: Snippet } = $props();

  let context = createDraggableContext({
    delegate: getter(() => delegate),
  });

  let onmousemove = (e: MouseEvent) => context.onMouseMove(e);
  let onmouseup = (e: MouseEvent) => context.onMouseUp(e);
</script>

<svelte:window {onmousemove} {onmouseup} />

<div class="group">
  {@render children()}
</div>

{#each context.over as model (model)}
  <div
    class="over"
    style:--x="{model.rect?.x}px"
    style:--y="{model.rect?.y}px"
    style:--width="{model.rect?.width}px"
    style:--height="{model.rect?.height}px"
    transition:fade={{ duration: 150 }}
  ></div>
{/each}

<style lang="scss">
  .group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .over {
    position: fixed;
    top: 0;
    left: 0;
    --offset: 2px;
    --height-offset: 1px;
    transform: translate(calc(var(--x) + var(--offset)), calc(var(--y) + var(--offset)));
    width: calc(var(--width) - calc(2 * var(--offset)));
    height: calc(var(--height) - calc(2 * var(--offset)) - var(--height-offset));
    background: rgba(255, 0, 0, 0.1);
    border-radius: 4px;
  }
</style>
