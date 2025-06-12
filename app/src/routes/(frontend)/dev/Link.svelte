<script lang="ts">
  import Children from './Children.svelte';
  import type { MarkdownElement } from './models.svelte';

  let { node }: { node: MarkdownElement } = $props();
  let href = $derived(node.attributes.href);
</script>

<a {href}><Children {node} /></a>
