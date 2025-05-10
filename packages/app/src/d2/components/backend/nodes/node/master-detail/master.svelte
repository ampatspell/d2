<script lang="ts">
  import Inspector from '$d2/components/dark/inspector/inspector.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import type { NodeDefinitionModel } from '$d2/lib/definition/node.svelte';
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';

  let { node, definition }: { node: NodeDocumentModel; definition: NodeDefinitionModel } = $props();
</script>

<Overflow overflow="y">
  <Inspector>
    <definition.backend {node} />
  </Inspector>
</Overflow>
