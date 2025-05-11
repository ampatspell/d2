<script lang="ts">
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
  import MasterDetail from '$d2/components/dark/section/page/master-detail.svelte';
  import Detail from './detail.svelte';
  import Master from './master.svelte';

  let { node }: { node: NodeDocumentModel } = $props();
</script>

<MasterDetail>
  {#snippet master()}
    <Master {node} />
  {/snippet}
  {#snippet detail()}
    <Detail {node} />
  {/snippet}
</MasterDetail>
