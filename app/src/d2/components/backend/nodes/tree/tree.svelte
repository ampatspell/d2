<script lang="ts">
  import Tree from '$d2/components/dark/tree/tree.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import { NodeModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import Item from './item.svelte';
  import { NodesTreeDelegate, type NodesTreeSettings } from './models.svelte';

  let {
    nodes,
    selected,
    settings,
    isReorderable,
    onSelect,
  }: {
    nodes: NodesModel;
    selected: NodeModel | undefined;
    settings: NodesTreeSettings;
    isReorderable?: boolean;
    onSelect: (model: NodeModel | undefined) => void;
  } = $props();

  let delegate = new NodesTreeDelegate({
    nodes: getter(() => nodes),
    onSelect: (node) => onSelect(node),
    selected: getter(() => selected),
    settings: getter(() => settings),
    isReorderable: getter(() => isReorderable),
  });
</script>

<Tree {delegate}>
  {#snippet item({ model, delegate, level })}
    <Item {model} {level} {delegate} />
  {/snippet}
</Tree>
