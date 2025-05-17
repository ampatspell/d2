<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createDraggableContext, type DraggableDelegate } from './models.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import Over from './over.svelte';

  let { delegate, children }: { delegate: DraggableDelegate; children: Snippet } = $props();

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
  {#if context.over}
    <Over model={context.over} />
  {/if}
</div>

<style lang="scss">
  .group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
