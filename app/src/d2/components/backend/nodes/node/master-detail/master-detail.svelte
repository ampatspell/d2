<script lang="ts">
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import MasterDetail from '$d2/components/dark/section/page/master-detail.svelte';
  import Detail from './detail.svelte';
  import Master from './master.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';

  let { node, nodes }: { node: NodeModel; nodes: NodesModel } = $props();
</script>

<MasterDetail>
  {#snippet master()}
    <Master {node} {nodes} />
  {/snippet}
  {#snippet detail()}
    <Detail {node} />
  {/snippet}
</MasterDetail>
