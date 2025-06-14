<script lang="ts">
  import type { Property } from '$d2/lib/base/utils/property.svelte';
  import Input from './input.svelte';

  let { property, multiline }: { multiline?: boolean; property: Property<string> } = $props();

  let value = $derived(property.value);
  let onInput = (next: string) => (value = next);
  let onBlur = () => property.update(value);
</script>

<Input {value} {multiline} {onInput} {onBlur} />
