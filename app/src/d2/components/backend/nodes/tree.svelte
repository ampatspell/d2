<script lang="ts" module>
  export type NodesTreeSettings = {
    isOpen: (id: string) => boolean;
    setOpen: (id: string, open: boolean) => void;
  };
</script>

<script lang="ts">
  import Tree, { type TreeModelDelegate } from '$d2/components/dark/tree.svelte';
  import { getter, options } from '$d2/lib/base/utils/options';
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';

  let {
    nodes,
    selected,
    settings,
    onSelect,
  }: {
    nodes: NodesModel;
    selected: NodeModel | undefined;
    settings: NodesTreeSettings;
    onSelect: (model: NodeModel | undefined) => void;
  } = $props();

  let models = $derived(nodes.byParentId(null));

  let delegateFor = (model: NodeModel) => {
    return options<TreeModelDelegate<NodeModel>>({
      children: getter(() => nodes.byParentId(model.id)),
      isOpen: getter(() => settings.isOpen(model.id)),
      isSelected: getter(() => selected?.id === model.id),
      select: () => onSelect(model),
      icon: getter(() => model.icon),
      setOpen: (isOpen) => settings.setOpen(model.id, isOpen),
    });
  };

  let deselect = () => onSelect(undefined);
</script>

<Tree {models} {delegateFor} {deselect}>
  {#snippet item(model: NodeModel)}
    <div class="item">
      <div class="identifier">{model.identifier}</div>
      <div class="kind">{model.name}</div>
    </div>
  {/snippet}
</Tree>

<style lang="scss">
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    > .identifier {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1;
    }
    > .kind {
      font-size: 10px;
      color: var(--dark-faded-color-1);
    }
  }
</style>
