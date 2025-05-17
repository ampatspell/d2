<script lang="ts" module>
  import type { VoidCallback } from '$d2/lib/base/utils/types';

  export type TreeModelDelegate<T> = {
    children: T[];
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    isSelected: boolean;
    isFaded?: boolean;
    select: VoidCallback;
    icon: Component;
  };

  export type TreeOnReorder<T> = DraggableOnDrop<T>;

  export type TreeDelegate<T> = {
    isReorderable: boolean;
    models: T[];
    deselect: VoidCallback;
    children: (model: T) => T[];
    delegateFor: (model: T) => TreeModelDelegate<T>;
    onReorder: (opts: TreeOnReorder<T>) => void;
  };
</script>

<script lang="ts" generics="T">
  import type { Component, Snippet } from 'svelte';
  import Group from '../draggable/group.svelte';
  import { type DraggableDelegate, type DraggableOnDrop } from '../draggable/models.svelte';
  import { getter, options } from '$d2/lib/base/utils/options';
  import Draggable from '../draggable/draggable.svelte';
  import Tree from './tree.svelte';

  // eslint-disable-next-line svelte/no-unused-props
  let {
    delegate: _treeDelegate,
    item,
  }: {
    delegate: TreeDelegate<T>;
    item: Snippet<[{ model: T; delegate: TreeModelDelegate<T>; level: number }]>;
  } = $props();

  let element = $state<HTMLDivElement>();
  let dragging = $state<T>();

  let disabled = $derived.by(() => {
    if (dragging) {
      return [dragging, ..._treeDelegate.children(dragging)];
    }
    return [];
  });

  let treeDelegate = options<TreeDelegate<T>>({
    models: getter(() => _treeDelegate.models),
    isReorderable: getter(() => _treeDelegate.isReorderable),
    deselect: () => _treeDelegate.deselect(),
    children: (model) => _treeDelegate.children(model),
    onReorder: (opts) => _treeDelegate.onReorder(opts),
    delegateFor: (model) => {
      const delegate = _treeDelegate.delegateFor(model);
      return options<TreeModelDelegate<T>>({
        children: getter(() => delegate.children),
        icon: getter(() => delegate.icon),
        isOpen: getter(() => delegate.isOpen),
        isSelected: getter(() => delegate.isSelected),
        isFaded: getter(() => disabled.includes(model)),
        select: () => delegate.select(),
        setOpen: (open) => delegate.setOpen(open),
      });
    },
  });

  let deselect = (e: Event) => {
    if (e.target === element) {
      treeDelegate.deselect();
    }
  };

  let draggableDelegate = options<DraggableDelegate>({
    isDraggable: getter(() => treeDelegate.isReorderable),
    onDragging: (model) => (dragging = model as T | undefined),
    isValidTarget: (model) => !disabled.includes(model as T),
    onDrop: (opts) => {
      _treeDelegate.onReorder({
        source: opts.source as T,
        position: opts.position,
        target: opts.target as T,
      });
    },
  });

  let createDraggingTreeDelegate = (model: T) =>
    options<TreeDelegate<T>>({
      isReorderable: false,
      models: [model],
      deselect: () => treeDelegate.deselect(),
      children: (model) => treeDelegate.children(model),
      onReorder: () => {},
      delegateFor: (model) => {
        let delegate = treeDelegate.delegateFor(model);
        return options<TreeModelDelegate<T>>({
          children: getter(() => delegate.children),
          icon: getter(() => delegate.icon),
          isOpen: delegate.isOpen,
          isSelected: false,
          isFaded: false,
          select: () => {},
          setOpen: () => {},
        });
      },
    });
</script>

{#snippet group(model: T, level: number)}
  {@const delegate = treeDelegate.delegateFor(model)}
  <Draggable {model}>
    {@render item({ model, delegate, level })}
    {#snippet dragging()}
      {@const delegate = createDraggingTreeDelegate(model)}
      <div class="dragging" style:--width="320px">
        <Tree {delegate}>
          {#snippet item({ model, delegate, level })}
            {@render item({ model, delegate, level })}
          {/snippet}
        </Tree>
      </div>
    {/snippet}
  </Draggable>
  {#if delegate.isOpen}
    {@render array(delegate.children, level + 1)}
  {/if}
{/snippet}

{#snippet array(models: T[], level: number)}
  {#each models as model (model)}
    {@render group(model, level)}
  {/each}
{/snippet}

<Group delegate={draggableDelegate}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="tree" bind:this={element} onclick={deselect}>
    {@render array(treeDelegate.models, 0)}
  </div>
</Group>

<style lang="scss">
  .tree {
    flex: 1;
    display: flex;
    flex-direction: column;
    user-select: none;
    .dragging {
      width: var(--width);
    }
  }
</style>
