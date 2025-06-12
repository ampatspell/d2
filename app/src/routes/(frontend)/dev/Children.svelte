<script lang="ts">
  import type { Node as NodeType, Parent } from 'mdast';
  import Node from './Node.svelte';

  let { node }: { node: NodeType } = $props();
  let parent = $derived(node as Parent);
  let children = $derived(parent.children);
</script>

{#each children as node (node)}
  <Node {node} />
{/each}
