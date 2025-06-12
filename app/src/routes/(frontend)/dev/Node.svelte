<script lang="ts">
  import Literal from './Literal.svelte';
  import Element from './Element.svelte';
  import type { MarkdownNode } from './models.svelte';

  let { node }: { node: MarkdownNode } = $props();
</script>

{#if node.type === 'text'}
  <Literal {node} />
{:else if node.type === 'element'}
  <Element {node} />
{/if}
