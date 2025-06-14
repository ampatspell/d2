<script lang="ts">
  import Icon from '$d2/components/dark/icon.svelte';
  import { FileNodeModel } from '$d2/lib/definition/file/node.svelte';
  import type { NodeModel } from '$d2/lib/nodes/node/node.svelte';

  let { model }: { model: NodeModel } = $props();
</script>

<div class="item">
  {#if model instanceof FileNodeModel && model.asImage}
    <div class="thumbnail" style:--url="url({model.asImage.thumbnails['400x400'].url})"></div>
  {:else}
    <div class="icon">
      <Icon icon={model.icon} />
      <div class="type">{model.kind}</div>
    </div>
  {/if}
  <div class="description">
    {model.identifier}
  </div>
</div>

<style lang="scss">
  .item {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1px solid var(--dark-border-color-1);
    border-radius: 3px;
    min-width: 0;
    > .thumbnail {
      flex: 1;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: var(--url);
    }
    > .icon {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      > .type {
        font-size: var(--dark-font-size-small);
      }
    }
    > .description {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: center;
      padding: 2px;
    }
  }
</style>
