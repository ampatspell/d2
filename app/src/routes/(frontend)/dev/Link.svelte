<script lang="ts">
  import Children from './Children.svelte';
  import type { Element } from './models.svelte';

  let { node }: { node: Element } = $props();
  let href = $derived(node.properties.href);
</script>

<a {href}><Children {node} /></a>
