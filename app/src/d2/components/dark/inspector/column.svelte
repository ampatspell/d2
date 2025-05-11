<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    label,
    flex: _flex,
    children,
  }: {
    label?: string;
    flex?: boolean;
    children?: Snippet;
  } = $props();

  let flex = $derived(_flex ?? true);
</script>

<div class="column" class:flex>
  {#if label}
    <div class="label">{label}</div>
  {/if}
  <div class="content">
    {@render children?.()}
  </div>
</div>

<style lang="scss">
  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    > .label {
      color: var(--dark-faded-color-1);
      font-size: var(--dark-font-size-small);
    }
    &.flex {
      flex: 1;
    }
    min-width: 0;
    > .content {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
