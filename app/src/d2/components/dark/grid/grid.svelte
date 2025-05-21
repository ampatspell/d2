<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { createGridContext, type GridDelegate } from './models.svelte';
  import { getter, options } from '$d2/lib/base/utils/options';
  import DraggableGroup from '../draggable/draggable-group.svelte';
  import type { DraggableGroupDelegate, DraggableOnDrop } from '../draggable/models.svelte';
  import Draggable from '../draggable/draggable.svelte';

  let {
    delegate: gridDelegate,
    item,
  }: {
    delegate: GridDelegate<T>;
    item: Snippet<[{ model: T }]>;
  } = $props();

  let element = $state<HTMLDivElement>();
  let width = $state<number>();

  let context = createGridContext({
    models: getter(() => gridDelegate.models),
    element: getter(() => element),
    width: getter(() => width),
  });

  let size = $derived(context.size);

  let dragging = $state<unknown>();

  let draggableDelegate = options<DraggableGroupDelegate>({
    direction: 'horizontal',
    onDragging: (model) => (dragging = model),
    isDraggable: getter(() => gridDelegate.isDraggable),
    onDrop: (opts) => gridDelegate.onDrop(opts as DraggableOnDrop<T>),
  });
</script>

{#snippet _item(model: T, isDragging: boolean)}
  <div class={['item', !isDragging && model === dragging && 'faded']} style:--size="{context.item}px">
    {@render item({ model })}
  </div>
{/snippet}

<div class="grid" style:--gap="{context.gap}px" bind:this={element} bind:clientWidth={width}>
  {#if gridDelegate.models.length}
    {#if size}
      <DraggableGroup delegate={draggableDelegate}>
        <div class="content" style:--width="{size.width}px" style:--height="{size.height}px">
          {#each context.models as model (model)}
            <Draggable {model}>
              {@render _item(model, false)}
              {#snippet dragging()}
                {@render _item(model, true)}
              {/snippet}
            </Draggable>
          {/each}
        </div>
      </DraggableGroup>
    {/if}
  {/if}
</div>

<style lang="scss">
  .grid {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
    .content {
      width: var(--width);
      height: var(--height);
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--gap);
      .item {
        width: var(--size);
        height: var(--size);
        transition: 0.15s ease-in-out opacity;
        &.faded {
          opacity: 0.25;
        }
      }
    }
  }
</style>
