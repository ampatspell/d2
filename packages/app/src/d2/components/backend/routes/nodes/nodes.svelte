<script lang="ts">
  import { goto } from '$app/navigation';
  import Upload from '$d2/components/dark/section/page/upload.svelte';
  import Section from '$d2/components/dark/section/section.svelte';
  import Tree, { type TreeModelDelegate } from '$d2/components/dark/tree.svelte';
  import LucideFile from '$d2/icons/lucide--file.svelte';
  import { addObject, removeObject } from '$d2/lib/base/utils/array';
  import { getter, options } from '$d2/lib/base/utils/options';
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { Snippet } from 'svelte';
  import { openUploadFilesModal } from '../../nodes/node/upload/models.svelte';
  import { getModalsContext } from '$d2/components/dark/modals/base/context.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import Add from '$d2/components/dark/section/page/add.svelte';
  import { openSelectNodeModal } from '../../nodes/add/models.svelte';

  let {
    id,
    nodes,
    route,
    children,
  }: {
    id: string | undefined;
    nodes: NodesModel;
    route: (node: NodeDocumentModel | undefined) => string;
    children: Snippet;
  } = $props();

  let open = $state<string[]>([]);

  let models = $derived(nodes.byParentId(null));
  let selected = $derived(nodes.byId(id));

  let select = (model: NodeDocumentModel) => {
    goto(route(model));
  };

  let delegateFor = (model: NodeDocumentModel) => {
    return options<TreeModelDelegate<NodeDocumentModel>>({
      children: getter(() => nodes.byParentId(model.id)),
      isOpen: getter(() => open.includes(model.id)),
      isSelected: getter(() => id === model.id),
      select: () => select(model),
      setOpen: (isOpen) => {
        if (isOpen) {
          addObject(open, model.id);
        } else {
          removeObject(open, model.id);
        }
      },
    });
  };

  let deselect = () => goto(route(undefined));

  let modals = getModalsContext();

  let onUpload = () => {
    if (selected) {
      openUploadFilesModal(modals, {
        node: getter(() => selected),
      });
    }
  };

  let onAdd = async () => {
    let resolution = await openSelectNodeModal(modals, { parent: selected });
    if (resolution) {
      let node = await nodes.create(resolution);
      if (node) {
        select(node);
      }
    }
  };
</script>

<Section title="Nodes" icon={LucideFile} {children}>
  {#snippet accessories()}
    {#if selected?.exists}
      <Upload {onUpload} />
    {/if}
    {#if !selected || selected.exists}
      <Add {onAdd} />
    {/if}
  {/snippet}
  {#snippet sidebar()}
    <Overflow overflow="y">
      <Tree {models} {delegateFor} {deselect}>
        {#snippet item(model: NodeDocumentModel)}
          <div class="item">
            <div class="identifier">{model.identifier}</div>
            <div class="kind">{model.kind}</div>
          </div>
        {/snippet}
      </Tree>
    </Overflow>
  {/snippet}
</Section>

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
    > .kind {
      font-size: 10px;
      color: var(--dark-faded-color-1);
    }
  }
</style>
