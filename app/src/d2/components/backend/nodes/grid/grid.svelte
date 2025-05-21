<script lang="ts">
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import Grid from '$d2/components/dark/grid/grid.svelte';
  import { getter, options } from '$d2/lib/base/utils/options';
  import type { GridDelegate, GridModelDelegate } from '$d2/components/dark/grid/models.svelte';
  import Item from './item.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';

  let { models, nodes }: { models: NodeModel[]; nodes: NodesModel } = $props();

  let delegate = options<GridDelegate<NodeModel>>({
    isDraggable: true,
    models: getter(() => models),
    delegateFor: () => {
      return options<GridModelDelegate>({
        isSelected: false,
        select: () => {},
      });
    },
    deselect: () => {},
    onDrop: (opts) => nodes.reorder(opts),
  });
</script>

<Grid {delegate}>
  {#snippet item({ model })}
    <Item {model} />
  {/snippet}
</Grid>
