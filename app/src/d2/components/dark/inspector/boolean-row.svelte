<script lang="ts">
  import { toOptional, type Property } from '$d2/lib/base/utils/property.svelte';
  import BasicDropdownRow from './basic-dropdown-row.svelte';

  let {
    label,
    property,
  }: {
    label: string;
    property: Property<boolean>;
  } = $props();

  let items = [true, false];
  let optional = $derived(toOptional(property, false));
</script>

{#snippet item(value: boolean)}
  {value ? 'Yes' : 'No'}
{/snippet}

<BasicDropdownRow {label} property={optional} {items} {item} />
