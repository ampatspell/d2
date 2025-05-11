<script lang="ts">
  import Column from '$d2/components/dark/inspector/column.svelte';
  import Row from '$d2/components/dark/inspector/row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import type { FileNodeDocumentModel } from './node.svelte';

  let { node }: { node: FileNodeDocumentModel } = $props();

  let filename = $derived(node.data.properties.filename);
  let url = $derived.by(() => {
    if (node.data.properties.type === 'image') {
      return node.data.properties.thumbnails['1024x1024'].url;
    }
  });
</script>

{#if url}
  <Section>
    <Column>
      <Row>
        <!-- svelte-ignore a11y_missing_attribute -->
        <img src={url} />
      </Row>
    </Column>
  </Section>
{/if}
<Section>
  <Column>
    <Row>
      {filename}
    </Row>
  </Column>
</Section>
