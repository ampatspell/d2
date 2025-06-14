<script lang="ts">
  import Children from '$d2/components/markdown/Children.svelte';
  import type { BoxMarkdownModel } from './model.svelte';

  let { model }: { model: BoxMarkdownModel } = $props();
  let node = $derived(model.node);
</script>

<div class="box"><Children {node} /></div>

<style lang="scss">
  .box {
    border: 1px solid var(--dark-accent-color-1);
    padding: 10px;
    border-radius: 3px;
  }
</style>
