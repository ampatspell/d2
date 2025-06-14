<script lang="ts">
  import type { MarkdownElement } from '$d2/lib/markdown/tree';
  import Children from './Children.svelte';

  let { node }: { node: MarkdownElement } = $props();
  let name = $derived(node.name);
</script>

<svelte:element this={name}>
  <Children {node} />
</svelte:element>
