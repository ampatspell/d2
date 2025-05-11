<script lang="ts">
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import type { IndexNodeDocumentModel } from './node.svelte';

  let { node }: { node: IndexNodeDocumentModel } = $props();

  let title = $derived(node.properties.title);
</script>

<Section>
  <InputRow label="Title" property={title} />
</Section>
