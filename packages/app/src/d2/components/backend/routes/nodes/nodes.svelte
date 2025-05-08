<script lang="ts">
  import { goto } from '$app/navigation';
  import Add from '$d2/components/dark/section/page/add.svelte';
  import Upload from '$d2/components/dark/section/page/upload.svelte';
  import Section from '$d2/components/dark/section/section.svelte';
  import Tree, { type TreeModelDelegate } from '$d2/components/dark/tree.svelte';
  import LucideFile from '$d2/icons/lucide--file.svelte';
  import { addObject, removeObject } from '$d2/lib/base/utils/array';
  import { getter, options } from '$d2/lib/base/utils/options';
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { Snippet } from 'svelte';
  import { openUploadFilesModal } from '../../node/upload/models.svelte';
  import { getModalsContext } from '$d2/components/dark/modals/base/context.svelte';

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

  let delegateFor = (model: NodeDocumentModel) => {
    return options<TreeModelDelegate<NodeDocumentModel>>({
      children: getter(() => nodes.byParentId(model.id)),
      isOpen: getter(() => open.includes(model.id)),
      isSelected: getter(() => id === model.id),
      select: () => goto(route(model)),
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

  let onAdd = () => {};
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
    <Tree {models} {delegateFor} {deselect}>
      {#snippet item(model: NodeDocumentModel)}
        {model.id} / {model.kind}
      {/snippet}
    </Tree>
  {/snippet}
</Section>
