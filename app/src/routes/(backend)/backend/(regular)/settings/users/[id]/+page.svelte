<script lang="ts">
  import User from '$d2/components/backend/routes/settings/users/user/user.svelte';
  import { subscribe } from '$d2/lib/base/refactoring/subscribable.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let user = $derived(data.user);

  $effect(() => subscribe(user));
</script>

<User {user} />
