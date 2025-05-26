<script lang="ts" generics="T extends HasPosition, I extends ArrayPropertyItemModel<T>">
  import type { Snippet } from 'svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';
  import type { ArrayPropertyModel, ArrayPropertyItemModel } from '$d2/lib/base/utils/property.svelte';
  import type { HasPosition } from '$d2/lib/base/utils/types';
  import LucideTrash_2 from '$d2/icons/lucide--trash-2.svelte';
  import Icon from '../icon.svelte';
  import Button from '../button.svelte';
  import Draggable from '../draggable/draggable.svelte';
  import DraggableGroup from '../draggable/draggable-group.svelte';
  import type { DraggableGroupDelegate } from '../draggable/models.svelte';
  import { options } from '$d2/lib/base/utils/options';

  let { label, model, item }: { label: string; model: ArrayPropertyModel<T, I>; item: Snippet<[I]> } = $props();

  let dragging = $state<unknown>();

  let delegate = options<DraggableGroupDelegate>({
    isDraggable: true,
    direction: 'vertical',
    onDragging: (model) => (dragging = model),
    isValidTarget: (model) => dragging !== model,
    onDrop: (opts) => {
      console.log(opts);
    },
  });

  let rect = $state<DOMRectReadOnly>();
  let width = $derived(rect?.width ?? 0);
</script>

{#snippet row(props: I, dragged: boolean)}
  {@const w = dragged ? `${width}px` : 'auto'}
  <div class="row" class:dragging={props === dragging && !dragged} style:--width={w}>
    <div class="content">
      {@render item(props)}
    </div>
    <div class="actions">
      <Icon icon={LucideTrash_2} onClick={() => props.delete()} />
    </div>
  </div>
{/snippet}

<Row>
  <Column {label} flex={true}>
    <div class="content">
      <DraggableGroup {delegate}>
        <div class="rows" bind:contentRect={rect}>
          {#each model.items as props (props)}
            <Draggable model={props}>
              {@render row(props, false)}
              {#snippet dragging()}
                {@render row(props, true)}
              {/snippet}
            </Draggable>
          {/each}
        </div>
      </DraggableGroup>
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
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }
  .row {
    width: var(--width, auto);
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
      transition: 0.15s ease-in-out opacity;
    }
    > .actions {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      transition: 0.15s ease-in-out opacity;
    }
    &.dragging {
      > .content,
      > .actions {
        opacity: 0.25;
      }
    }
  }
</style>
