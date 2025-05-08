<script lang="ts">
  import type { Property } from '$d2/lib/base/utils/property.svelte';
  import Input from '../input.svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';

  let { label, property }: { label: string; property: Property<string> } = $props();

  let value = $derived(property.value);
  let onInput = (next: string) => (value = next);
  let onBlur = () => property.update(value);
</script>

<Row>
  <Column {label} flex={true}>
    <Input {value} {onInput} {onBlur} />
  </Column>
</Row>
