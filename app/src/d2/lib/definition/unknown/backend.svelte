<script lang="ts">
  import Column from '$d2/components/dark/inspector/column.svelte';
  import Row from '$d2/components/dark/inspector/row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import ValueRow from '$d2/components/dark/inspector/value-row.svelte';
  import Json from '$d2/components/dark/json.svelte';
  import type { UnknownNodeModel } from './node.svelte';

  let { node }: { node: UnknownNodeModel } = $props();
</script>

<Section>
  <ValueRow label="ID" value={node.id} />
  <Row>
    <Column label="Document" flex={true}>
      <Json data={node.data} />
    </Column>
  </Row>
</Section>
