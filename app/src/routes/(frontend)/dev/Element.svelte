<script lang="ts">
  import { elements, type MarkdownElement } from './models.svelte';
  import Custom from './Custom.svelte';
  import Basic from './Basic.svelte';

  let { node }: { node: MarkdownElement } = $props();
  let name = $derived(node.name);
  let isBasic = $derived(elements.includes(name));
</script>

{#if isBasic}
  <Basic {node} />
{:else}
  <Custom {node} />
{/if}
