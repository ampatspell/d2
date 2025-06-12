<script lang="ts">
  import type { Literal, Node } from 'mdast';

  let { node }: { node: Node } = $props();
  let value = $derived((node as Literal).value);
</script>

{value}
