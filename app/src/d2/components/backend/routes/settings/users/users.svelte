<script lang="ts">
  import { goto } from '$app/navigation';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import Section from '$d2/components/dark/section/section.svelte';
  import Cell from '$d2/components/dark/table/cell.svelte';
  import Row from '$d2/components/dark/table/row.svelte';
  import Table from '$d2/components/dark/table/table.svelte';
  import LucideUsers from '$d2/icons/lucide--users.svelte';
  import type { UsersModel } from '$d2/lib/users/users.svelte';
  import type { Snippet } from 'svelte';

  let { users, id, children }: { users: UsersModel; id: string | undefined; children: Snippet } = $props();

  let onDeselect = () => goto('/backend/settings/users');
</script>

<Section title="Users" icon={LucideUsers}>
  {#snippet sidebar()}
    <Overflow overflow="y">
      <Table {onDeselect}>
        {#each users.all as user (user)}
          <Cell route="/backend/settings/users/{user.id}" isSelected={id === user.id}>
            <Row value={user.email} />
          </Cell>
        {/each}
      </Table>
    </Overflow>
  {/snippet}
  {@render children()}
</Section>
