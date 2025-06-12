<script lang="ts">
  import Node from './Node.svelte';
  import { asParent, type MarkdownNode } from './models.svelte';

  let { node }: { node: MarkdownNode } = $props();
  let element = $derived(asParent(node));
  let children = $derived(element?.children);
</script>

{#if children}
  {#each children as node (node)}
    <Node {node} />
  {/each}
{/if}
