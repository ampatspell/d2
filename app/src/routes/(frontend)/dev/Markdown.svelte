<script lang="ts">
  import type { Root } from 'mdast';
  import Children from './Children.svelte';
  import { createMarkdownContext, type MarkdownDelegate } from './models.svelte';

  let { node, delegate }: { node: Root; delegate: MarkdownDelegate } = $props();

  createMarkdownContext(delegate);
</script>

<Children {node} />
