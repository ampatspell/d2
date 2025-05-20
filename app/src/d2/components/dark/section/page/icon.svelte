<script lang="ts">
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import type { Component } from 'svelte';
  import Icon from '../../icon.svelte';

  let {
    icon,
    onClick,
    route,
    element = $bindable(),
  }: {
    icon: Component;
    route?: string;
    onClick?: VoidCallback;
    element?: HTMLElement;
  } = $props();
</script>

{#snippet content()}
  <Icon {icon} {onClick} />
{/snippet}

{#if route}
  <a class="icon has-action" href={route} bind:this={element}>
    {@render content()}
  </a>
{:else}
  <div class={['icon', !!onClick && 'has-action']} bind:this={element}>
    {@render content()}
  </div>
{/if}

<style lang="scss">
  .icon {
    user-select: none;
    &.has-action {
      cursor: pointer;
    }
  }
</style>
