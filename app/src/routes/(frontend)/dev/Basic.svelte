<script lang="ts">
  import type { Node } from 'mdast';
  import { type Element } from './models.svelte';
  import Children from './Children.svelte';

  let { node }: { node: Node } = $props();
  let element = $derived(node as Element);
  let tagName = $derived(element.tagName.toLowerCase());
</script>

<svelte:element this={tagName}>
  <Children {node} />
</svelte:element>
