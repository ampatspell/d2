<script lang="ts">
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import { toRequired } from '$d2/lib/base/utils/property.svelte';
  import type { MissingNodeDocumentModel } from './node.svelte';

  let { node }: { node: MissingNodeDocumentModel } = $props();

  let message = $derived(toRequired(node.properties.message, ''));
</script>

<Section>
  <InputRow label="Message" property={message} />
</Section>
