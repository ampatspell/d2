<script lang="ts" generics="T">
  import type { Component, Snippet } from 'svelte';
  import { createGridContext, type GridDelegate, type GridModelDelegate } from './models.svelte';
  import { getter } from '$d2/lib/base/utils/options';

  let {
    delegate: gridDelegate,
    item,
  }: {
    delegate: GridDelegate<T>;
    item: Snippet<[{ model: T; delegate: GridModelDelegate<T> }]>;
  } = $props();

  let element = $state<HTMLDivElement>();
  let width = $state<number>();

  let context = createGridContext({
    models: getter(() => gridDelegate.models),
    element: getter(() => element),
    width: getter(() => width),
  });

  let size = $derived(context.size);
</script>

<div class="grid" style:--gap="{context.gap}px" bind:this={element} bind:clientWidth={width}>
  {#if gridDelegate.models.length}
    {#if size}
      <div class="content" style:--width="{size.width}px" style:--height="{size.height}px">
        {#each context.models as model (model)}
          {@const itemDelegate = gridDelegate.delegateFor(model)}
          <div class="item" style:--size="{context.item}px">
            {@render item({ model, delegate: itemDelegate })}
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style lang="scss">
  .grid {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    > .content {
      width: var(--width);
      height: var(--height);
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--gap);
      > .item {
        width: var(--size);
        height: var(--size);
        border: 1px solid red;
      }
    }
  }
</style>
