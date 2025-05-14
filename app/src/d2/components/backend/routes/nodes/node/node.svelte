<script lang="ts">
  import MasterDetail from '$d2/components/backend/nodes/node/master-detail/master-detail.svelte';
  import Delete from '$d2/components/dark/section/page/delete.svelte';
  import Page from '$d2/components/dark/section/page/page.svelte';
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';

  let {
    node,
    nodes,
    onWillDelete
  }: {
    node: NodeModel;
    nodes: NodesModel;
    onWillDelete: VoidCallback;
  } = $props();

  let title = $derived(node.identifier);

  let onDelete = async () => {
    onWillDelete();
    await node.delete();
  };
</script>

<Page {title}>
  {#snippet actions()}
    <Delete name="node" {onDelete} />
  {/snippet}
  <MasterDetail {node} {nodes} />
</Page>
