<script lang="ts">
  import Children from '$d2/components/markdown/Children.svelte';
  import type { LinkMarkdownModel } from './model.svelte';

  let { model }: { model: LinkMarkdownModel } = $props();
  let href = $derived(model.href);
  let node = $derived(model.node);
</script>

<a {href}><Children {node} /></a>
