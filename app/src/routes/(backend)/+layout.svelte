<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import { createModalsContext } from '$d2/components/dark/modals/base/context.svelte';
  import Dark from '$d2/components/dark/dark.svelte';
  import Modals from '$d2/components/dark/modals/base/modals.svelte';
  import Layout from '$d2/components/layout.svelte';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
  let route = $derived(data.route);

  createModalsContext();
</script>

<svelte:head>
  <title>{route}</title>
</svelte:head>

<Layout>
  <Dark>
    {@render children()}
    <Modals />
  </Dark>
</Layout>
