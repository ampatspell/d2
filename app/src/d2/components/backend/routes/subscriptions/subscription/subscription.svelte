<script lang="ts">
  import { goto } from '$app/navigation';
  import Inspector from '$d2/components/dark/inspector/inspector.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import ValueRow from '$d2/components/dark/inspector/value-row.svelte';
  import Delete from '$d2/components/dark/section/page/delete.svelte';
  import Page from '$d2/components/dark/section/page/page.svelte';
  import type { SubscriptionModel } from '$d2/lib/subscriptions/subscriptions.svelte';

  let { subscription }: { subscription: SubscriptionModel } = $props();

  let onWillDelete = () => {
    goto('/backend/subscriptions');
  };

  let onDelete = async () => {
    onWillDelete();
    await subscription.delete();
  };
</script>

{#snippet actions()}
  <Delete name="subscription" {onDelete} />
{/snippet}

<Page title={subscription.email} {actions}>
  <Inspector>
    <Section>
      <ValueRow label="Kinds" value={subscription.kinds.join(', ')} />
      <ValueRow label="Email" value={subscription.email} />
      <ValueRow label="Full name" value={subscription.fullName} />
    </Section>
  </Inspector>
</Page>
