<script lang="ts">
  import { page } from '$app/state';
  import Section from '$d2/components/dark/section/section.svelte';
  import Cell from '$d2/components/dark/table/cell.svelte';
  import Row from '$d2/components/dark/table/row.svelte';
  import Table from '$d2/components/dark/table/table.svelte';
  import LucideSettings from '$d2/icons/lucide--settings.svelte';
  import type { Snippet } from 'svelte';

  let {
    children,
  }: {
    children: Snippet;
  } = $props();

  let route = $derived(page.url.pathname);

  let rows = [
    {
      route: '/backend/settings/me',
      label: 'Me',
    },
    {
      route: '/backend/settings/users',
      label: 'Users',
    },
  ];
</script>

{#snippet sidebar()}
  <Table>
    {#each rows as row (row)}
      <Cell route={row.route} isSelected={route.startsWith(row.route)}>
        <Row value={row.label} />
      </Cell>
    {/each}
  </Table>
{/snippet}

<Section title="Settings" icon={LucideSettings} {sidebar}>
  {@render children()}
</Section>
