<script lang="ts">
  import LucideClipboardCopy from '$d2/icons/lucide--clipboard-copy.svelte';
  import Icon from '$d2/components/dark/icon.svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';
    import { copyToClipboard } from '$d2/lib/base/utils/browser';

  let {
    label,
    value,
    copy,
  }: {
    label: string;
    value: string | number | undefined | null;
    copy?: boolean;
  } = $props();

  let onCopy = () => copyToClipboard(String(value));
</script>

<Row>
  <Column {label}>
    {#if value === undefined}
      Not set
    {:else}
      <div class="value">
        <div class="content">
          {value}
        </div>
        {#if copy}
          <Icon icon={LucideClipboardCopy} size="small" onClick={onCopy} />
        {/if}
      </div>
    {/if}
  </Column>
</Row>

<style lang="scss">
  .value {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    > .content {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
