<script lang="ts">
  import type { Property } from '$d2/lib/base/utils/property.svelte';
  import PropertyInput from '../property-input.svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';

  let { label, multiline, property }: { label: string; multiline?: boolean; property: Property<string> } = $props();
</script>

<Row>
  <Column {label} flex={true}>
    <PropertyInput {multiline} {property} />
  </Column>
</Row>
