<script lang="ts">
  import { PUBLIC_APP_NAME } from '$env/static/public';
  import type { Snippet } from 'svelte';
  import { createModalsContext } from '$d2/components/dark/modals/base/context.svelte';
  import Dark from '$d2/components/dark/dark.svelte';
  import Modals from '$d2/components/dark/modals/base/modals.svelte';
  import Layout from '$d2/components/layout.svelte';

  let { children }: { children: Snippet } = $props();

  let name = PUBLIC_APP_NAME;

  createModalsContext();
</script>

<svelte:head>
  <title>{name} • backend</title>
</svelte:head>

<Layout>
  <Dark>
    {@render children()}
    <Modals />
  </Dark>
</Layout>
