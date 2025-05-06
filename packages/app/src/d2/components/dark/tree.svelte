<script lang="ts" module>
  export type TreeModelDelegate<T> = {
    children: T[];
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    isSelected: boolean;
    select: VoidCallback;
  };
</script>

<script lang="ts" generics="T">
  import Icon from '$d2/components/dark/icon.svelte';
  import LucideChevronDown from '$d2/icons/lucide--chevron-down.svelte';
  import LucideFile from '$d2/icons/lucide--file.svelte';
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import type { Snippet } from 'svelte';

  let {
    models,
    delegateFor,
    item,
    deselect: _deselect,
  }: {
    models: T[];
    delegateFor: (model: T) => TreeModelDelegate<T>;
    deselect: VoidCallback;
    item: Snippet<[T]>;
  } = $props();

  let select = (delegate: TreeModelDelegate<T>) => () => {
    if (delegate.isSelected) {
      delegate.setOpen(!delegate.isOpen);
    } else {
      delegate.select();
    }
  };

  let setOpen = (delegate: TreeModelDelegate<T>) => (e: Event) => {
    e.stopPropagation();
    if (!delegate.isOpen) {
      delegate.select();
    }
    delegate.setOpen(!delegate.isOpen);
  };

  let tree = $state<HTMLDivElement>();
  let deselect = (e: Event) => {
    if (e.target === tree) {
      _deselect();
    }
  };
</script>

{#snippet group(current: T, level: number)}
  {@const delegate = delegateFor(current)}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="group">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="item" class:selected={delegate.isSelected} style:--offset="{level * 20}px" onclick={select(delegate)}>
      <div class="toggle" class:closed={delegate.children.length && !delegate.isOpen}>
        {#if delegate.children.length}
          <Icon icon={LucideChevronDown} onClick={setOpen(delegate)} size="small" />
        {:else}
          <Icon icon={LucideFile} size="small" />
        {/if}
      </div>
      <div class="content">
        {@render item(current)}
      </div>
    </div>
    {#if delegate.isOpen}
      {@render array(delegate.children, level + 1)}
    {/if}
  </div>
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
  .group {
    > .item {
      padding: 5px 10px 5px calc(10px + var(--offset));
      border-bottom: 1px solid #eee;
      display: flex;
      flex-direction: row;
      gap: 5px;
      > .toggle {
        width: 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        transition: rotate 0.15s ease-in-out;
        &.closed {
          rotate: -90deg;
        }
      }
      > .content {
        flex: 1;
      }
      &.selected {
        background: var(--dark-selected-background-color-1);
      }
    }
  }
</style>
