<script lang="ts">
  import type { MarkdownText } from './models.svelte';

  let { node }: { node: MarkdownText } = $props();
  let value = $derived(node.value);
</script>

{value}
