<script lang="ts">
  import Subscription from '$d2/components/backend/routes/subscriptions/subscription/subscription.svelte';
  import Placeholder from '$d2/components/dark/section/placeholder.svelte';
  import { subscribe } from '$d2/lib/base/refactoring/subscribable.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let subscription = $derived(data.subscription);
  $effect(() => subscribe(subscription));
</script>

{#if subscription}
  <Subscription {subscription} />
{:else}
  <Placeholder label="Subscription not found" />
{/if}
