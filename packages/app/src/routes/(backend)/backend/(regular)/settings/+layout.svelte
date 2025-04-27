<script lang="ts">
  import type { Snippet } from 'svelte';
  import Settings from '$d2/components/backend/routes/settings/settings.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<Settings>
  {@render children()}
</Settings>
