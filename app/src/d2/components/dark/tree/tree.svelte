<script lang="ts" module>
  export type TreeModelDelegate<T> = {
    children: T[];
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    isSelected: boolean;
    select: VoidCallback;
    icon: Component;
  };
</script>

<script lang="ts" generics="T">
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import type { Component, Snippet } from 'svelte';

  let {
    models,
    delegateFor,
    item,
    deselect: _deselect,
  }: {
    models: T[];
    delegateFor: (model: T) => TreeModelDelegate<T>;
    deselect: VoidCallback;
    item: Snippet<[{ model: T; delegate: TreeModelDelegate<T>; level: number }]>;
  } = $props();

  let tree = $state<HTMLDivElement>();
  let deselect = (e: Event) => {
    if (e.target === tree) {
      _deselect();
    }
  };
</script>

{#snippet group(model: T, level: number)}
  {@const delegate = delegateFor(model)}
  {@render item({ model, delegate, level })}
  {#if delegate.isOpen}
    {@render array(delegate.children, level + 1)}
  {/if}
{/snippet}

{#snippet array(models: T[], level: number)}
  {#each models as model (model)}
    {@render group(model, level)}
  {/each}
{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="tree" bind:this={tree} onclick={deselect}>
  {@render array(models, 0)}
</div>

<style lang="scss">
  .tree {
    flex: 1;
    display: flex;
    flex-direction: column;
    user-select: none;
  }
</style>
