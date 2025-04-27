<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import Layout from '$d2/components/backend/layout/layout.svelte';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
  let route = $derived(data.route);
</script>

<Layout {route}>
  {@render children()}
</Layout>
