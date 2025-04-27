<script lang="ts">
  import type { Snippet } from "svelte";
  import Layout from '$d2/components/layout.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<Layout>
  {@render children()}
</Layout>
