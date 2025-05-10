<script lang="ts">
  import type { Snippet } from 'svelte';
  import Layout from '$d2/components/backend/layout/layout.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<Layout>
  {@render children()}
</Layout>
