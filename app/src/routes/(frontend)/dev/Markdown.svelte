<script lang="ts">
  import Children from './Children.svelte';
  import { createMarkdownContext, type MarkdownDelegate, type MarkdownRoot } from './models.svelte';

  let { node, delegate }: { node: MarkdownRoot; delegate: MarkdownDelegate } = $props();

  createMarkdownContext(delegate);
</script>

<Children {node} />
