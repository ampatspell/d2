<script lang="ts" generics="T extends HasPosition, I extends ArrayPropertyItemModel<T>">
  import type { Snippet } from 'svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';
  import type { ArrayPropertyModel, ArrayPropertyItemModel } from '$d2/lib/base/utils/property.svelte';
  import type { HasPosition } from '$d2/lib/base/utils/types';
  import LucideTrash_2 from '$d2/icons/lucide--trash-2.svelte';
  import Icon from '../icon.svelte';
  import Button from '../button.svelte';

  let { label, model, item }: { label: string; model: ArrayPropertyModel<T, I>; item: Snippet<[I]> } = $props();
</script>

<Row>
  <Column {label} flex={true}>
    <div class="content">
      <div class="rows">
        {#each model.items as props (props)}
          <div class="row">
            <div class="content">
              {@render item(props)}
            </div>
            <div class="actions">
              <Icon icon={LucideTrash_2} onClick={() => props.delete()} />
            </div>
          </div>
        {/each}
      </div>
      <div class="add">
        <Button label="Add new" onClick={() => model.add()} />
      </div>
    </div>
  </Column>
</Row>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    gap: 5px;
    .rows {
      display: flex;
      flex-direction: column;
      gap: 5px;
      .row {
        user-select: none;
        padding: 5px;
        display: flex;
        flex-direction: row;
        gap: 5px;
        border: 1px solid var(--dark-border-color-1);
        border-radius: 3px;
        > .content {
          --inspector-row-padding: 0;
          display: flex;
          flex-direction: row;
          flex: 1;
        }
        > .actions {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
        }
      }
    }
  }
</style>
