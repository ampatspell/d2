<script lang="ts">
  import { px } from '$d2/lib/base/utils/number';
  import { getter } from '$d2/lib/base/utils/options';
  import type { PlacementComponentProps } from '../placement.svelte';
  import { RelativeToPlacementObserver } from './observer.svelte';
  import type { RelativeToPlacement } from './relative-to.svelte';

  let { modal, children }: PlacementComponentProps = $props();
  let placement = $derived(modal.placement as RelativeToPlacement);

  let content = $state<HTMLDivElement>();

  let observer = new RelativeToPlacementObserver({
    placement: getter(() => placement),
    content: getter(() => content),
  });

  let rect = $derived(observer.rect);
  let left = $derived(px(rect?.left));
  let top = $derived(px(rect?.top));

  let hasPosition = $derived(!!rect && !!left && !!top);
</script>

<div class="relative-to" class:has-position={hasPosition} style:--left={left} style:--top={top} bind:this={content}>
  {@render children()}
</div>

<style lang="scss">
  .relative-to {
    position: fixed;
    visibility: hidden;
    &.has-position {
      visibility: visible;
      left: var(--left);
      top: var(--top);
    }
  }
</style>
