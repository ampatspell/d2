<script lang="ts">
  import type { MissingNodeDocumentModel } from './node.svelte';

  let { node }: { node: MissingNodeDocumentModel } = $props();
</script>

<div class="backend">
  {node}
</div>

<style lang="scss">
  .backend {
    padding: 10px;
  }
</style>
