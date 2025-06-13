<script lang="ts">
  import Custom from './Custom.svelte';
  import Basic from './Basic.svelte';
  import type { MarkdownElement } from '$d2/lib/markdown/tree';

  let { node }: { node: MarkdownElement } = $props();

  const elements = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'pre', 'code', 'blockquote', 'strong', 'em'];

  let isBasic = $derived(elements.includes(node.name));
</script>

{#if isBasic}
  <Basic {node} />
{:else}
  <Custom {node} />
{/if}
