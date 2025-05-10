<script lang="ts">
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import type { Snippet } from 'svelte';

  let {
    children,
    route,
    onClick,
    isSelected: _isSelected,
  }: {
    children: Snippet;
    route?: string;
    onClick?: VoidCallback;
    isSelected?: boolean;
  } = $props();

  let isSelected = $derived(_isSelected ?? false);
</script>

{#snippet content()}
  {@render children?.()}
{/snippet}

{#if route || onClick}
  {#if route}
    <a class="cell has-action" class:selected={isSelected} href={route}>
      {@render content()}
    </a>
  {:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="cell has-action" class:selected={isSelected} onclick={onClick}>
      {@render content()}
    </div>
  {/if}
{:else}
  <div class="cell no-action" class:selected={isSelected}>
    {@render content()}
  </div>
{/if}

<style lang="scss">
  .cell {
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
    min-height: 32px;
    gap: 3px;
    justify-content: center;
    border-bottom: 1px solid var(--dark-border-color-1);
    text-decoration: none;
    &.selected {
      background: var(--dark-selected-background-color-1);
    }
    &.has-action {
      &:hover {
        background: var(--dark-selected-background-color-1);
      }
    }
  }
</style>
