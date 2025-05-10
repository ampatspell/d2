<script lang="ts">
  import { goto } from '$app/navigation';
  import Section from '$d2/components/dark/section/section.svelte';
  import LucideFile from '$d2/icons/lucide--file.svelte';
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { Snippet } from 'svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import type { NodesSettingsModel } from '$d2/lib/nodes/user.svelte';
  import Add from '../../nodes/add/add.svelte';
  import Upload from '../../nodes/upload.svelte';
  import Fold from '../../nodes/fold.svelte';
  import Tree from '../../nodes/tree.svelte';

  let {
    id,
    nodes,
    settings,
    route,
    children,
  }: {
    id: string | undefined;
    nodes: NodesModel;
    settings: NodesSettingsModel;
    route: (node: NodeDocumentModel | undefined) => string;
    children: Snippet;
  } = $props();

  let selected = $derived(nodes.byId(id));
  let onSelect = (model: NodeDocumentModel | undefined) => goto(route(model));
</script>

<Section title="Nodes" icon={LucideFile} {children}>
  {#snippet accessories()}
    <Fold {nodes} {settings} {onSelect} />
    <Upload {selected} />
    <Add {nodes} {selected} {onSelect} />
  {/snippet}
  {#snippet sidebar()}
    <Overflow overflow="y">
      <Tree {nodes} {selected} {settings} {onSelect} />
    </Overflow>
  {/snippet}
</Section>
