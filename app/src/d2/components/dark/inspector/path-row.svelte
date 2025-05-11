<script lang="ts">
  import LucideClipboardCopy from '$d2/icons/lucide--clipboard-copy.svelte';
  import Icon from '$d2/components/dark/icon.svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';
  import { isTruthy } from '$d2/lib/base/utils/array';
  import { copyToClipboard } from '$d2/lib/base/utils/browser';

  let {
    label,
    value,
  }: {
    label: string;
    value: string | undefined;
  } = $props();

  let parts = $derived(value?.split('/').filter(isTruthy) ?? []);

  let onCopy = () => copyToClipboard(value);
</script>

<Row>
  <Column {label}>
    {#if value === undefined}
      Not set
    {:else}
      <div class="content">
        <div class="value">
          {#each parts as part, idx (part)}
            <div class="part" style:--offset="{idx * 10}px">/{part}</div>
          {/each}
        </div>
        <Icon icon={LucideClipboardCopy} size="small" onClick={onCopy} />
      </div>
    {/if}
  </Column>
</Row>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 5px;
    > .value {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      gap: 1px;
      > .part {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 0 0 var(--offset);
      }
    }
  }
</style>
