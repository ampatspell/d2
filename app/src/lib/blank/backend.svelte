<script lang="ts">
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import NodeRow from '$d2/components/dark/inspector/node-row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import { toRequired } from '$d2/lib/base/utils/property.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { BlankNodeDocumentModel } from './node.svelte';

  let { node, nodes }: { node: BlankNodeDocumentModel; nodes: NodesModel } = $props();

  let title = $derived(node.properties.title);
  let backgroundProperty = $derived(toRequired(node.properties.background, ''));
</script>

<Section>
  <InputRow label="Title" property={title} />
  <NodeRow label="Background" property={backgroundProperty} {nodes} />
</Section>
