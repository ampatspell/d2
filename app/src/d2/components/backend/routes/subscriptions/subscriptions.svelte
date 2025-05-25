<script lang="ts">
  import { goto } from '$app/navigation';
  import Section from '$d2/components/dark/section/section.svelte';
  import type { Snippet } from 'svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import type { SubscriptionModel, SubscriptionsModel } from '$d2/lib/subscriptions/subscriptions.svelte';
  import Table from '$d2/components/dark/table/table.svelte';
  import Cell from '$d2/components/dark/table/cell.svelte';
  import Row from '$d2/components/dark/table/row.svelte';
  import LucideMail from '$d2/icons/lucide--mail.svelte';

  let {
    id,
    subscriptions,
    route,
    children,
  }: {
    id: string | undefined;
    subscriptions: SubscriptionsModel;
    route: (node: SubscriptionModel | undefined) => string;
    children: Snippet;
  } = $props();

  let selected = $derived(subscriptions.byId(id));
  let onSelect = (model: SubscriptionModel | undefined) => goto(route(model));
  let onDeselect = () => onSelect(undefined);
</script>

<Section title="Subscriptions" icon={LucideMail}>
  {#snippet sidebar()}
    <Overflow overflow="y">
      <Table {onDeselect}>
        {#each subscriptions.all as subscription (subscription)}
          <Cell route={route(subscription)} isSelected={selected === subscription}>
            <Row value={subscription.email} />
          </Cell>
        {/each}
      </Table>
    </Overflow>
  {/snippet}
  {@render children()}
</Section>
