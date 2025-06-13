<script lang="ts">
  import { getMarkdownContext, type MarkdownElement } from './models.svelte';
  import Custom from './Custom.svelte';
  import Basic from './Basic.svelte';

  let { node }: { node: MarkdownElement } = $props();
  let markdown = getMarkdownContext();
  let isBasic = $derived(markdown.isBasicElement(node));
</script>

{#if isBasic}
  <Basic {node} />
{:else}
  <Custom {node} />
{/if}
