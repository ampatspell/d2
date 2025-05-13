<script lang="ts">
  import Users from '$d2/components/backend/routes/settings/users/users.svelte';
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  let users = $derived(data.users);
  let id = $derived(data.id);

  $effect(() => subscribe(users));
</script>

<Users {users} {id}>
  {@render children()}
</Users>
