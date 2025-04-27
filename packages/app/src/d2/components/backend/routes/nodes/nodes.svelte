<script lang="ts">
  import Section from '$d2/components/dark/section/section.svelte';
  import LucideFile from '$d2/icons/lucide--file.svelte';
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { Snippet } from 'svelte';

  let {
    id,
    nodes,
    route,
    children,
  }: {
    id: string | undefined;
    nodes: NodesModel;
    route: (node: NodeDocumentModel<never>) => string;
    children: Snippet;
  } = $props();
</script>

<Section title="Nodes" icon={LucideFile}>
  {@render children()}
</Section>
