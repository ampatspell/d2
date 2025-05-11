<script lang="ts">
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
    import type { BlankNodeDocumentModel } from './node.svelte';

  let { node }: { node: BlankNodeDocumentModel } = $props();

  let title = $derived(node.properties.title);
</script>

<Section>
  <InputRow label="Title" property={title} />
</Section>
