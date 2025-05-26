<script lang="ts">
  import type { DraggableModel } from './models.svelte';

  let { model }: { model: DraggableModel } = $props();

  let level = $derived(model.level * 18);
</script>

{#if model.over}
  <div
    class={['marker', model.direction, model.over]}
    style:--x="{model.rect?.x}px"
    style:--y="{model.rect?.y}px"
    style:--width="{model.rect?.width}px"
    style:--height="{model.rect?.height}px"
    style:--level="{level}px"
  ></div>
{/if}

<style lang="scss">
  .marker {
    --marker: 4px;
    position: fixed;
    top: 0;
    left: 0;
    background: var(--dark-accent-color-1);
    border-radius: var(--marker);
    transition: 0.1s ease-in-out all;
    &.horizontal-flat {
      --offset: 5px;
      &.before,
      &.after {
        height: var(--height);
        width: var(--marker);
      }
      &.before {
        transform: translate(calc(var(--x) - var(--offset)), var(--y));
      }
      &.after {
        transform: translate(calc(var(--x) + var(--width) + var(--offset) - var(--marker)), var(--y));
      }
    }
    &.vertical-flat {
      --offset: 3px;
      &.before,
      &.after {
        height: var(--marker);
        width: var(--width);
      }
      &.before {
        transform: translate(calc(var(--x)), calc(var(--y) - calc(var(--marker) / 2) - var(--offset)));
      }
      &.after {
        transform: translate(var(--x), calc(var(--y) + var(--height) - calc(var(--marker) / 2) + var(--offset)));
      }
    }
    &.vertical-tree {
      --offset: 2px;
      &.before,
      &.after {
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
  }
</style>
