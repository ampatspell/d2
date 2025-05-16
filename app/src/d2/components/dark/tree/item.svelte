<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import type { TreeModelDelegate } from './tree.svelte';
  import LucideChevronDown from '$d2/icons/lucide--chevron-down.svelte';
  import Icon from '../icon.svelte';

  let {
    level,
    delegate,
    children,
  }: {
    level: number;
    delegate: TreeModelDelegate<T>;
    children: Snippet;
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
    delegate.setOpen(!delegate.isOpen);
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="item" class:selected={delegate.isSelected} style:--offset="{level * 18}px" onclick={select(delegate)}>
  <div class="toggle" class:closed={delegate.children.length && !delegate.isOpen}>
    {#if delegate.children.length}
      <Icon icon={LucideChevronDown} onClick={setOpen(delegate)} size="small" />
    {/if}
  </div>
  <Icon icon={delegate.icon} size="small" />
  <div class="content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  .item {
    padding: 5px 10px 5px calc(10px + var(--offset));
    border-bottom: 1px solid #eee;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    height: 32px;
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
      min-width: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &.selected {
      background: var(--dark-selected-background-color-1);
    }
  }
</style>
