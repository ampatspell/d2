<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createDraggableContext, type DraggableGroupDelegate } from './models.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import Over from './-over.svelte';

  let { delegate, children }: { delegate: DraggableGroupDelegate; children: Snippet } = $props();

  let context = createDraggableContext({
    delegate: getter(() => delegate),
  });

  let onmousemove = (e: MouseEvent) => context.onMouseMove(e);
  let onmouseup = (e: MouseEvent) => context.onMouseUp(e);
  let onkeyup = (e: KeyboardEvent) => context.onKeyUp(e);
</script>

<svelte:window {onmousemove} {onmouseup} {onkeyup} />

<div class="group">
  {@render children()}
  {#if context.draggable}
    <Over model={context.draggable} />
  {/if}
</div>

<style lang="scss">
  .group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
