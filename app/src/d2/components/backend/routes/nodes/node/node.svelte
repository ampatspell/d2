<script lang="ts">
  import { goto } from '$app/navigation';
  import MasterDetail from '$d2/components/backend/nodes/node/master-detail/master-detail.svelte';
  import Delete from '$d2/components/dark/section/page/delete.svelte';
  import Icon from '$d2/components/dark/section/page/icon.svelte';
  import Page from '$d2/components/dark/section/page/page.svelte';
  import LucideLayoutGrid from '$d2/icons/lucide--layout-grid.svelte';
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';

  let {
    node,
    nodes,
  }: {
    node: NodeModel;
    nodes: NodesModel;
  } = $props();

  let title = $derived(node.path.value);

  let onWillDelete = () => {
    let parent = node?.parent?.id;
    if (parent) {
      goto(`/backend/nodes/${parent}`);
    } else {
      goto('/backend/nodes');
    }
  };

  let onDelete = async () => {
    onWillDelete();
    await node.delete();
  };

  let children = $derived(nodes.byParentId(node.id));
  let hasChildren = $derived(children.length > 0);
</script>

<Page {title}>
  {#snippet actions()}
    {#if hasChildren}
      <Icon icon={LucideLayoutGrid} route="/backend/nodes/{node.id}/grid" />
    {/if}
    <Delete name="node" {onDelete} />
  {/snippet}
  <MasterDetail {node} {nodes} />
</Page>
