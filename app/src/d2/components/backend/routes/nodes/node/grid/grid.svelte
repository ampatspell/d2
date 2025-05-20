<script lang="ts">
  import Page from '$d2/components/dark/section/page/page.svelte';
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';

  let { node, nodes }: { node: NodeModel; nodes: NodesModel } = $props();

  let title = $derived(node.path.value);
</script>

<Page {title} icon={node.icon} back="/backend/nodes/{node.id}">
  {node}
</Page>
