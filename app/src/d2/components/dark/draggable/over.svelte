<script lang="ts">
  import type { DraggableModel } from './models.svelte';
  import { classes } from '$d2/lib/base/utils/classes';

  let { model }: { model: DraggableModel } = $props();
</script>

{#if model.over}
  <div
    class={classes('over', model.over)}
    style:--x="{model.rect?.x}px"
    style:--y="{model.rect?.y}px"
    style:--width="{model.rect?.width}px"
    style:--height="{model.rect?.height}px"
  ></div>
{/if}

<style lang="scss">
  .over {
    position: fixed;
    top: 0;
    left: 0;
    background: var(--dark-accent-color-1);
    border-radius: 4px;
    --offset: 2px;
    &.before,
    &.after {
      --marker: 4px;
      width: calc(var(--width) - calc(2 * var(--offset)));
      height: var(--marker);
    }
    &.before {
      transform: translate(calc(var(--x) + var(--offset)), calc(var(--y) - calc(var(--marker) / 2)));
    }
    &.after {
      transform: translate(calc(var(--x) + var(--offset)), calc(var(--y) + var(--height) - calc(var(--marker) / 2)));
    }
    &.item {
      --height-offset: 1px;
      transform: translate(calc(var(--x) + var(--offset)), calc(var(--y) + var(--offset)));
      width: calc(var(--width) - calc(2 * var(--offset)));
      height: calc(var(--height) - calc(2 * var(--offset)) - var(--height-offset));
    }
  }
</style>
