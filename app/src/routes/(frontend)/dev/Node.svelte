<script lang="ts">
  import type { Node as NodeType } from 'mdast';
  import Literal from './Literal.svelte';
  import Element from './Element.svelte';

  let { node }: { node: NodeType } = $props();
</script>

{#if node.type === 'text'}
  <Literal {node} />
{:else if node.type === 'element'}
  <Element {node} />
{/if}
