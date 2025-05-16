<script lang="ts" module>
  export type NodesTreeSettings = {
    isOpen: (id: string) => boolean;
    setOpen: (id: string, open: boolean) => void;
  };
</script>

<script lang="ts">
  import Draggable from '$d2/components/dark/draggable/draggable.svelte';
  import Group from '$d2/components/dark/draggable/group.svelte';
  import type { DraggableDelegate } from '$d2/components/dark/draggable/models.svelte';
  import Tree, { type TreeModelDelegate } from '$d2/components/dark/tree/tree.svelte';
  import { getter, options } from '$d2/lib/base/utils/options';
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import Item from './item.svelte';

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

  let models = $derived(nodes.byParentId(null));

  let dragging = $state<NodeModel>();

    let isDragging = (model: NodeModel) => {
    if (dragging && model.backend) {
      return model.backend.isOrHasParent(dragging);
    }
    return false;
  };

  let createTreeDelegateFor = (opts: { hasSelection: boolean }) => (model: NodeModel) => {
    return options<TreeModelDelegate<NodeModel>>({
      children: getter(() => nodes.byParentId(model.id)),
      isOpen: getter(() => settings.isOpen(model.id)),
      isSelected: getter(() => model !== dragging && opts.hasSelection && selected?.id === model.id),
      isFaded: getter(() => opts.hasSelection && isDragging(model)),
      select: () => onSelect(model),
      icon: getter(() => model.icon),
      setOpen: (isOpen) => settings.setOpen(model.id, isOpen),
    });
  };

  let delegateFor = createTreeDelegateFor({ hasSelection: true });
  let delegateForDragging = createTreeDelegateFor({ hasSelection: false });

  let draggableDelegate = options<DraggableDelegate>({
    isDraggable: getter(() => isReorderable ?? false),
    onDragging: (model) => (dragging = model as NodeModel | undefined),
  });

  let deselect = () => onSelect(undefined);
</script>

<Group delegate={draggableDelegate}>
  <Tree {models} {delegateFor} {deselect}>
    {#snippet item({ model, delegate, level })}
      <Draggable {model}>
        <Item {model} {level} {delegate} />
        {#snippet dragging()}
          <div class="dragging">
            <Tree models={[model]} delegateFor={delegateForDragging} {deselect}>
              {#snippet item({ model, delegate, level })}
                <Item {model} {level} {delegate} />
              {/snippet}
            </Tree>
          </div>
        {/snippet}
      </Draggable>
    {/snippet}
  </Tree>
</Group>

<style lang="scss">
  .dragging {
    width: 320px;
  }
</style>
