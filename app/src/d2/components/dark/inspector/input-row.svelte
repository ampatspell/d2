<script lang="ts">
  import type { Property } from '$d2/lib/base/utils/property.svelte';
  import PropertyInput from '../property-input.svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';

  let { label, property }: { label: string; property: Property<string> } = $props();
</script>

<Row>
  <Column {label} flex={true}>
    <PropertyInput {property} />
  </Column>
</Row>
