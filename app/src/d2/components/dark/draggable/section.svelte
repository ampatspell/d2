<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createDraggableSectionContext, getDraggableContext } from './models.svelte';
  import { getter } from '$d2/lib/base/utils/options';

  let { model, children }: { model: unknown; children: Snippet } = $props();

  const context = getDraggableContext();

  createDraggableSectionContext({
    context: getter(() => context),
    model: getter(() => model),
  });
</script>

<div class="section">
  {@render children()}
</div>

<style lang="scss">
  .section {
    display: contents;
  }
</style>
