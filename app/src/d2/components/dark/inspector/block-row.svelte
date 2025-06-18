<script lang="ts">
  import type { BlockModel } from '$d2/lib/blocks/block.svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';

  let { label, block }: { label: string; block: BlockModel | undefined } = $props();
</script>

<Row>
  <Column {label} flex={true}>
    {block}
  </Column>
</Row>
