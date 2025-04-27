<script lang="ts">
  import Nodes from '$d2/components/backend/routes/nodes/nodes.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<Nodes>
  {@render children()}
</Nodes>
