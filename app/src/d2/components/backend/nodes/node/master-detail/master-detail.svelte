<script lang="ts">
  import MasterDetail from '$d2/components/dark/section/page/master-detail.svelte';
  import Detail from './detail.svelte';
  import Master from './master.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { NodeModel } from '$d2/lib/nodes/node/node.svelte';

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
