<script lang="ts">
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import NodeRow from '$d2/components/dark/inspector/node-row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import { toRequired } from '$d2/lib/base/utils/property.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { BlankNodeModel } from './node.svelte';

  let { node, nodes }: { node: BlankNodeModel; nodes: NodesModel } = $props();

  let title = $derived(node.properties.title);
  let background = $derived(toRequired(node.properties.background, ''));
</script>

<Section>
  <InputRow label="Title" property={title} />
  <NodeRow label="Background" property={background} {nodes} />
</Section>
