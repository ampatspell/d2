<script lang="ts">
  import Children from './Children.svelte';
  import type { MarkdownElement } from './models.svelte';

  let { node }: { node: MarkdownElement } = $props();
  let name = $derived(node.name);
</script>

<svelte:element this={name}>
  <Children {node} />
</svelte:element>
