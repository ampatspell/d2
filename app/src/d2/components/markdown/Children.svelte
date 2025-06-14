<script lang="ts">
  import { asParent, type MarkdownNode } from '$d2/lib/markdown/tree';
  import Node from './Node.svelte';

  let { node }: { node: MarkdownNode } = $props();
  let element = $derived(asParent(node));
  let children = $derived(element?.children);
</script>

{#if children}
  {#each children as node (node)}
    <Node {node} />
  {/each}
{/if}
