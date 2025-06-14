<script lang="ts">
  import { getModalsContext } from '$d2/components/dark/modals/base/context.svelte';
  import { openSelectNodeDefinitionModal } from './models.svelte';
  import Add from '$d2/components/dark/section/page/add.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { NodeModel } from '$d2/lib/nodes/node/node.svelte';

  let {
    nodes,
    selected,
    onSelect,
  }: {
    nodes: NodesModel;
    selected: NodeModel | undefined;
    onSelect: (node: NodeModel) => void;
  } = $props();

  let modals = getModalsContext();
  let onAdd = async () => {
    let resolution = await openSelectNodeDefinitionModal(modals, { parent: selected });
    if (resolution) {
      let node = await nodes.create(resolution);
      if (node) {
        onSelect(node);
      }
    }
  };
</script>

{#if !selected || selected.exists}
  <Add {onAdd} />
{/if}
