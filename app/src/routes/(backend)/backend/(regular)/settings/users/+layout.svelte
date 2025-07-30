<script lang="ts">
  import Users from '$d2/components/backend/routes/settings/users/users.svelte';
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  let users = $derived(data.users);
  let id = $derived(data.id);
</script>

<Users {users} {id}>
  {@render children()}
</Users>
