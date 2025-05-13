<script lang="ts">
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import NodeRow from '$d2/components/dark/inspector/node-row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import { toRequired } from '$d2/lib/base/utils/property.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { GalleryNodeModel } from './node.svelte';

  let { node, nodes }: { node: GalleryNodeModel; nodes: NodesModel } = $props();

  let title = $derived(node.properties.title);
  let images = $derived(toRequired(node.properties.images, ''));
</script>

<Section>
  <InputRow label="Title" property={title} />
  <NodeRow label="Images" property={images} {nodes} />
</Section>
