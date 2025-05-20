<script lang="ts">
  import Page from '$d2/components/dark/section/page/page.svelte';
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import Grid from '$d2/components/backend/nodes/grid/grid.svelte';

  let { node, nodes }: { node: NodeModel; nodes: NodesModel } = $props();

  let title = $derived(node.path.value);
  let models = $derived(nodes.byParentId(node.id));
</script>

<Page {title} icon={node.icon} back="/backend/nodes/{node.id}">
  <div class="grid">
    <Grid {models} {nodes} />
  </div>
</Page>

<style lang="scss">
  .grid {
    padding: 10px;
  }
</style>
