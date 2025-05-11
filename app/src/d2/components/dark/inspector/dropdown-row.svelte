<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import Dropdown from '../dropdown/dropdown.svelte';
  import Item from '../dropdown/item.svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';
  import type { Property } from '$d2/lib/base/utils/property.svelte';

  let {
    label,
    property,
    items,
    placeholder = 'Not selected',
    item,
  }: {
    label: string;
    property: Property<T | undefined>;
    items: readonly T[];
    placeholder?: string;
    item: Snippet<[value: T]>;
  } = $props();

  let selected = $derived(property.value);
  let onSelect = (value: T | undefined) => property.update(value);
</script>

{#snippet _item(value?: T, isSelected?: boolean)}
  <Item {isSelected}>
    {#if value !== undefined}
      {@render item(value)}
    {:else}
      {placeholder}
    {/if}
  </Item>
{/snippet}

<Row>
  <Column {label} flex={true}>
    <div class="content">
      <Dropdown {selected} {items} {onSelect} item={_item} />
    </div>
  </Column>
</Row>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
  }
</style>
