<script lang="ts">
  import { analytics } from '$d2/lib/base/fire/analytics.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  analytics.initialize();
</script>

{@render children()}
