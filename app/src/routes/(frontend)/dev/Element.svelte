<script lang="ts">
  import type { Node } from 'mdast';
  import { elements, type Element } from './models.svelte';
  import Custom from './Custom.svelte';
  import Basic from './Basic.svelte';

  let { node }: { node: Node } = $props();
  let element = $derived(node as Element);
  let tagName = $derived(element.tagName.toLowerCase());
  let isBasic = $derived(elements.includes(tagName));
</script>

{#if isBasic}
  <Basic {node} />
{:else}
  <Custom {node} />
{/if}
