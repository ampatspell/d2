<script lang="ts">
  import Users from '$d2/components/backend/routes/settings/users/users.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<Users>
  {@render children()}
</Users>
