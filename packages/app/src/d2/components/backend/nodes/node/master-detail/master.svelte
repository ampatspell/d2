<script lang="ts">
  import Inspector from '$d2/components/dark/inspector/inspector.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';

  let { node }: { node: NodeDocumentModel } = $props();

  let definition = $derived(node.definition);
</script>

<Overflow overflow="y">
  <Inspector>
    <definition.backend {node} />
  </Inspector>
</Overflow>
