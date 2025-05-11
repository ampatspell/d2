<script lang="ts">
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import Button from '../button.svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';

  let { label, onClick }: { label: string; onClick: VoidCallback } = $props();
</script>

<Row>
  <Column flex={true}>
    <Button {label} {onClick} type="fill" />
  </Column>
</Row>
