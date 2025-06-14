<script lang="ts">
  import type { MarkdownText } from '$d2/lib/markdown/tree';

  let { node }: { node: MarkdownText } = $props();
  let value = $derived(node.value);
</script>

{value}
