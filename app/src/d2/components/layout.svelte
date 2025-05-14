<script lang="ts">
  import './layout.scss';
  import { page } from '$app/state';
  import LucideFlame from '$d2/icons/lucide--flame.svelte';
  import { getSession } from '$d2/lib/session/session.svelte';
  import Icon from './dark/icon.svelte';
  import type { Snippet } from 'svelte';
  // import Stats from './dark/stats.svelte';

  let session = getSession();
  let isAdmin = $derived(session.user?.isAdmin ?? false);
  let route = $derived(page.url.pathname);
  let isBackend = $derived(route.startsWith('/backend'));

  let { children, fonts }: { children: Snippet; fonts?: string[] } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap" rel="stylesheet" />
  {#if fonts}
    {#each fonts as href (href)}
      <link {href} rel="stylesheet" />
    {/each}
  {/if}
</svelte:head>

{@render children()}

<!-- <Stats /> -->

{#if isAdmin && !isBackend}
  <div class="admin">
    <Icon icon={LucideFlame} route="/backend" />
  </div>
{/if}

<style lang="scss">
  .admin {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 8px;
    opacity: 0;
    background: #fff;
    border-top-right-radius: 8px;;
    transition: 0.15s ease-in-out opacity;
    &:hover {
      opacity: 1;
    }
  }
</style>
