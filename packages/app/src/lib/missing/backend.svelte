<script lang="ts">
  import type { MissingNodeDocumentModel } from './node.svelte';

  let { node }: { node: MissingNodeDocumentModel } = $props();
</script>

{node}
