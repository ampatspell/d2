<script lang="ts">
  import Literal from './Literal.svelte';
  import Element from './Element.svelte';
  import type { MarkdownNode } from '$d2/lib/markdown/tree';

  let { node }: { node: MarkdownNode } = $props();
</script>

{#if node.type === 'text'}
  <Literal {node} />
{:else if node.type === 'element'}
  <Element {node} />
{/if}
