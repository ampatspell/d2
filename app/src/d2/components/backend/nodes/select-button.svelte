<script lang="ts">
  import { openSelectNodeModal } from '$d2/components/backend/nodes/node/select/models.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import Button from '../../dark/button.svelte';
  import { getModalsContext } from '../../dark/modals/base/context.svelte';
  import { relativeToBottomRight } from '../../dark/modals/base/placement/relative-to/relative-to.svelte';

  let { nodes, onSelect }: { nodes: NodesModel; onSelect: (node: NodeModel) => void } = $props();

  let modals = getModalsContext();
  let button = $state<HTMLButtonElement>();
  let onClick = async () => {
    let res = await openSelectNodeModal(modals, {
      nodes: getter(() => nodes),
      title: 'Select node',
      placement: relativeToBottomRight({
        relativeTo: button,
        offset: {
          x: 0,
          y: 3,
        },
      }),
    });
    if (res) {
      onSelect(res.node);
    }
  };
</script>

<Button label="Select node" {onClick} bind:element={button} />
