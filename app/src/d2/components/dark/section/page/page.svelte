<script lang="ts">
  import type { Component, Snippet } from 'svelte';
  import Overflow from '../../overflow.svelte';
  import Placeholder from '../placeholder.svelte';
  import LucideChevronLeft from '$d2/icons/lucide--chevron-left.svelte';
  import Icon from './icon.svelte';

  let {
    title,
    back,
    icon,
    actions,
    children,
  }: {
    title?: string;
    back?: string;
    icon?: Component;
    actions?: Snippet;
    children?: Snippet;
  } = $props();
</script>

<div class="page">
  <div class="header">
    <div class="section left">
      {#if back}
        <Icon icon={LucideChevronLeft} route={back} />
      {/if}
      {#if icon}
        <Icon {icon} />
      {/if}
      <div class="title">{title}</div>
    </div>
    {#if actions}
      <div class="section right">
        {@render actions()}
      </div>
    {/if}
  </div>
  <div class="content">
    {#if children}
      <Overflow overflow="y">
        {@render children()}
      </Overflow>
    {:else}
      <Placeholder />
    {/if}
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 10px;
      min-height: 32px;
      border-bottom: 1px solid var(--dark-border-color-1);
      > .section {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        &.left {
          flex: 1;
          > .title {
            font-weight: 600;
          }
        }
      }
    }
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
