<script lang="ts">
  import type { FileNodeDocumentModel } from './node.svelte';

  let { node }: { node: FileNodeDocumentModel } = $props();
</script>

{node}
