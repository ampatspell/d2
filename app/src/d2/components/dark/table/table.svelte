<script lang="ts">
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import type { Snippet } from 'svelte';

  let { children, onDeselect }: { children: Snippet; onDeselect?: VoidCallback } = $props();

  let table = $state<HTMLElement>();

  let onclick = (e: Event) => {
    if (e.target === table) {
      onDeselect?.();
    }
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="table" {onclick} bind:this={table}>
  <div class="content">
    {@render children?.()}
  </div>
</div>

<style lang="scss">
  .table {
    display: flex;
    flex-direction: column;
    flex: 1;
    > .content {
      display: flex;
      flex-direction: column;
    }
  }
</style>
