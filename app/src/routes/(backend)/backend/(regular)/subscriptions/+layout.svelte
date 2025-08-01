<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import { page } from '$app/state';
  import type { SubscriptionModel } from '$d2/lib/subscriptions/subscriptions.svelte';
  import { isTruthy } from '$d2/lib/base/utils/array';
  import Subscriptions from '$d2/components/backend/routes/subscriptions/subscriptions.svelte';
  import { subscribe } from '$d2/lib/base/refactoring/subscribable.svelte';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  let id = $derived(page.params.id);
  let subscriptions = $derived(data.subscriptions);

  let route = (node: SubscriptionModel | undefined) => {
    return [`/backend/subscriptions`, node?.id].filter(isTruthy).join('/');
  };

  $effect(() => subscribe(subscriptions));
</script>

<Subscriptions {id} {subscriptions} {route}>
  {@render children()}
</Subscriptions>
