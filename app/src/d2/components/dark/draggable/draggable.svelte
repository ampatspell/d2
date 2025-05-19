<script lang="ts">
  import type { Snippet } from 'svelte';
  import { DraggableModel, getDraggableContext } from './models.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import Dragging from './-dragging.svelte';

  let {
    model,
    level,
    children,
    dragging,
  }: {
    model: unknown;
    level?: number;
    children: Snippet;
    dragging: Snippet;
  } = $props();

  let context = getDraggableContext();

  let element = $state<HTMLDivElement>();

  let draggable = new DraggableModel({
    context: getter(() => context),
    element: getter(() => element),
    model: getter(() => model),
    level: getter(() => level),
  });

  $effect(() => context.register(draggable));

  let onmousedown = (e: MouseEvent) => {
    if (e.button === 0) {
      draggable.onMouseDown(e);
    }
  };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="draggable" bind:this={element} {onmousedown}>
  {@render children()}
  <Dragging {draggable}>
    {@render dragging()}
  </Dragging>
</div>
