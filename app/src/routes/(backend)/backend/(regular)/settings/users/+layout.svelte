<script lang="ts">
  import Users from '$d2/components/backend/routes/settings/users/users.svelte';
  import type { Snippet } from 'svelte';
  import type { LayoutData, LayoutParams } from './$types';
  import { subscribe } from '$d2/lib/base/refactoring/subscribable.svelte';

  let { data, params, children }: { data: LayoutData; params: LayoutParams; children: Snippet } = $props();

  let users = $derived(data.users);
  let id = $derived(params.id);

  $effect(() => subscribe(users));
</script>

<Users {users} {id}>
  {@render children()}
</Users>
