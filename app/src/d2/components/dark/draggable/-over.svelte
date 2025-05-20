<script lang="ts">
  import { classes } from '$d2/lib/base/utils/classes';
  import type { DraggableModel } from './models.svelte';

  let { model }: { model: DraggableModel } = $props();

  let level = $derived(model.level * 18);
</script>

{#if model.over}
  <div
    class={classes('marker', model.over)}
    style:--x="{model.rect?.x}px"
    style:--y="{model.rect?.y}px"
    style:--width="{model.rect?.width}px"
    style:--height="{model.rect?.height}px"
    style:--level="{level}px"
  ></div>
{/if}

<style lang="scss">
  .marker {
    position: fixed;
    top: 0;
    left: 0;
    background: var(--dark-accent-color-1);
    border-radius: 4px;
    --offset: 2px;
    &.before,
    &.after {
      --marker: 4px;
      width: calc(var(--width) - calc(2 * var(--offset)) - var(--marker) - var(--level));
      height: var(--marker);
    }
    &.before {
      transform: translate(calc(var(--x) + var(--offset) + var(--level)), calc(var(--y) - calc(var(--marker) / 2)));
    }
    &.after {
      transform: translate(
        calc(var(--x) + var(--offset) + var(--level)),
        calc(var(--y) + var(--height) - calc(var(--marker) / 2))
      );
    }
    &.over {
      --height-offset: 1px;
      transform: translate(calc(var(--x) + var(--offset) + var(--level)), calc(var(--y) + var(--offset)));
      width: calc(var(--width) - calc(2 * var(--offset)) - var(--level));
      height: calc(var(--height) - calc(2 * var(--offset)) - var(--height-offset));
    }
  }
</style>
