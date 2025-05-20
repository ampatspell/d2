<script lang="ts">
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import Grid from '$d2/components/dark/grid/grid.svelte';
  import { getter, options } from '$d2/lib/base/utils/options';
  import type { GridDelegate, GridModelDelegate } from '$d2/components/dark/grid/models.svelte';

  let { nodes }: { nodes: NodeModel[] } = $props();

  let delegate = options<GridDelegate<NodeModel>>({
    models: getter(() => nodes),
    delegateFor: (node) =>
      options<GridModelDelegate<NodeModel>>({
        icon: getter(() => node.icon),
        isSelected: false,
        select: () => {},
      }),
    deselect: () => {},
  });
</script>

<Grid {delegate}>
  {#snippet item({ model, delegate })}
    <div class="model">{model}</div>
  {/snippet}
</Grid>
