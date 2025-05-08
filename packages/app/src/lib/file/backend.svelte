<script lang="ts">
  import Column from '$d2/components/dark/inspector/column.svelte';
  import Row from '$d2/components/dark/inspector/row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import type { FileNodeDocumentModel } from './node.svelte';

  let { node }: { node: FileNodeDocumentModel } = $props();
</script>

<Section>
  <Column>
    <Row>
      {node}
    </Row>
  </Column>
</Section>
