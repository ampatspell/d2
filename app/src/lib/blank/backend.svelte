<script lang="ts">
  import { openSelectNodeModal } from '$d2/components/backend/nodes/node/select/models.svelte';
  import ButtonRow from '$d2/components/dark/inspector/button-row.svelte';
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import { getModalsContext } from '$d2/components/dark/modals/base/context.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { BlankNodeDocumentModel } from './node.svelte';

  let { node, nodes }: { node: BlankNodeDocumentModel; nodes: NodesModel } = $props();

  let modals = getModalsContext();
  let title = $derived(node.properties.title);
  let onOpen = async () => {
    let res = await openSelectNodeModal(modals, {
      nodes: getter(() => nodes),
      title: 'Select file',
    });
    console.log(res);
  };
</script>

<Section>
  <InputRow label="Title" property={title} />
  <ButtonRow label="Open" onClick={onOpen} />
</Section>
