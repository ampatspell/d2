<script lang="ts" module>
  export class DraggableState {
    phase = $state<'preflight' | 'dragging'>('preflight');

    onMouseDown(e: MouseEvent) {}
    onMouseMove(e: MouseEvent) {}
    onMouseUp(e: MouseEvent) {}
  }
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import { getDraggableContext } from "./draggable-array.svelte";

  let {
    model,
    children
  }: {
    model: unknown;
    children: Snippet;
  } = $props();

  let context = getDraggableContext();

  let state = $state<DraggableState>();

  let onmousedown = (e: MouseEvent) => {
    e.preventDefault();
    state = new DraggableState();
    state.onMouseDown(e);
  }

  let onmousemove = (e: MouseEvent) => {
    if(state) {
      e.preventDefault();
      state.onMouseMove(e);
    }
  }

  let onmouseup = (e: MouseEvent) => {
    if(state) {
      e.preventDefault();
      state.onMouseUp(e);
      state = undefined;
    }
  }
</script>

<svelte:window {onmousemove} {onmouseup} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="draggable-model" {onmousedown}>
  {@render children()}
</div>

<style lang="scss">
  .draggable-model {
    display: contents;
  }
</style>
