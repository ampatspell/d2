<script lang="ts">
  // import Stats from './dark/stats.svelte';
  import './layout.scss';
  import type { Snippet } from 'svelte';

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
