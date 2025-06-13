<script lang="ts">
  import type { MarkdownRoot } from '$d2/lib/markdown/tree';
  import Children from './Children.svelte';

  let { node }: { node: MarkdownRoot } = $props();
</script>

<Children {node} />
