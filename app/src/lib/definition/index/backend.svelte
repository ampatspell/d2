<script lang="ts">
  import ArrayRow from '$d2/components/dark/inspector/array-row.svelte';
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import NodeRow from '$d2/components/dark/inspector/node-row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import { toRequired } from '$d2/lib/base/utils/property.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { IndexNodeModel } from './node.svelte';

  let { node, nodes }: { node: IndexNodeModel; nodes: NodesModel } = $props();

  let title = $derived(node.properties.title);
  let background = $derived(toRequired(node.properties.background, ''));
  let introduction = $derived(toRequired(node.properties.introduction, ''));
  let links = $derived(node.properties.links);
</script>

<Section>
  <InputRow label="Title" property={title} />
  <NodeRow label="Background image" property={background} {nodes} />
  <InputRow label="Introduction" multiline={true} property={introduction} />
  <ArrayRow label="Links" model={links}>
    {#snippet item(link)}
      <InputRow label="Label" property={link.label} />
      <InputRow label="Path" property={link.path} />
    {/snippet}
  </ArrayRow>
</Section>
