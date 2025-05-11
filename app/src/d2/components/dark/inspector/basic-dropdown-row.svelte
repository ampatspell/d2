<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import DropdownRow from './dropdown-row.svelte';
  import type { Property } from '$d2/lib/base/utils/property.svelte';

  let {
    label,
    property,
    items,
    item,
  }: {
    label: string;
    property: Property<T | undefined>;
    items: readonly T[];
    item: Snippet<[value: T]>;
  } = $props();
</script>

<DropdownRow {label} {items} {property} {item} />
