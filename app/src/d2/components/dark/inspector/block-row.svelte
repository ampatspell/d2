<script lang="ts">
  import type { MapBlock } from '$d2/lib/blocks/map.svelte';
  import Button from '../button.svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';

  let { label, block }: { label: string; block: MapBlock } = $props();

  let onClear = () => {
    block.clear();
  };
  let onMarkdown = () => {
    block.property.update({ kind: 'markdown', properties: { content: 'hello' } });
  };
</script>

<Row>
  <Column {label} flex={true}>
    {block}
  </Column>
  <Column>
    <Button label="Clear" onClick={onClear} />
    <Button label="Markdown" onClick={onMarkdown} />
  </Column>
</Row>
