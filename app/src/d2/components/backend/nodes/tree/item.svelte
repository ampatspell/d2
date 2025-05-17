<script lang="ts">
  import Icon from '$d2/components/dark/icon.svelte';
  import type { TreeModelDelegate } from '$d2/components/dark/tree/tree.svelte';
  import LucideCloudUpload from '$d2/icons/lucide--cloud-upload.svelte';
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import Item from '$d2/components/dark/tree/item.svelte';

  let {
    model,
    level,
    delegate,
  }: {
    model: NodeModel;
    level: number;
    delegate: TreeModelDelegate<NodeModel>;
  } = $props();
</script>

<Item {delegate} {level}>
  <div class="item">
    <div class="identifier">{model.identifier} ({model.position})</div>
    <div class="accessories">
      <div class="node" class:is-busy={model.isBusy}>
        <Icon icon={LucideCloudUpload} size="small" />
      </div>
      <div class="kind">{model.name}</div>
    </div>
  </div>
</Item>

<style lang="scss">
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    > .identifier {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1;
    }
    > .accessories {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;
      > .node {
        opacity: 0;
        transition: 0.15s ease-in-out opacity;
        &.is-busy {
          opacity: 0.2;
        }
      }
      > .kind {
        font-size: 10px;
        color: var(--dark-faded-color-1);
      }
    }
  }
</style>
