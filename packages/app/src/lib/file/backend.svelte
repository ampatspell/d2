<script lang="ts">
  import type { FileNodeDocumentModel } from './node.svelte';

  let { node }: { node: FileNodeDocumentModel } = $props();
</script>

<div class="backend">
  {node}
</div>

<style lang="scss">
  .backend {
    padding: 10px;
  }
</style>
