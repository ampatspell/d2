<script lang="ts">
  import Inspector from '$d2/components/dark/inspector/inspector.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import type { NodeModel } from '$d2/lib/nodes/node/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';

  let { node, nodes }: { node: NodeModel; nodes: NodesModel } = $props();

  let definition = $derived(node.definition);
</script>

<Overflow overflow="y">
  <Inspector>
    <definition.backend {node} {nodes} />
  </Inspector>
</Overflow>
