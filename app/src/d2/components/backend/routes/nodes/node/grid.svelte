<script lang="ts">
  import Page from '$d2/components/dark/section/page/page.svelte';
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import Grid from '$d2/components/backend/nodes/grid/grid.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';

  let { node, nodes }: { node: NodeModel; nodes: NodesModel } = $props();

  let title = $derived(node.path.value);
  let models = $derived(nodes.byParentId(node.id));
</script>

<Page {title} icon={node.icon} back="/backend/nodes/{node.id}">
  <Overflow overflow="y">
    <div class="grid">
      <Grid {models} {nodes} />
    </div>
  </Overflow>
</Page>

<style lang="scss">
  .grid {
    padding: 10px;
  }
</style>
