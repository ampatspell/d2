<script lang="ts">
  import { openSelectNodeModal } from '$d2/components/backend/nodes/node/select/models.svelte';
  import ButtonRow from '$d2/components/dark/inspector/button-row.svelte';
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import { getModalsContext } from '$d2/components/dark/modals/base/context.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import { toRequired } from '$d2/lib/base/utils/property.svelte';
  import { setGlobal } from '$d2/lib/base/utils/set-global';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import type { BlankNodeDocumentModel } from './node.svelte';

  let { node, nodes }: { node: BlankNodeDocumentModel; nodes: NodesModel } = $props();

  let title = $derived(node.properties.title);
  let background = $derived(toRequired(node.properties.background, ''));
  let b = $derived(node.background);

  setGlobal({ node });

  let modals = getModalsContext();
  let onOpen = async () => {
    let res = await openSelectNodeModal(modals, {
      nodes: getter(() => nodes),
      title: 'Select file',
    });
    if (res) {
      background.update(res.node.path);
    }
  };
</script>

<Section>
  <InputRow label="Title" property={title} />
  <InputRow label="Background" property={background} />
  <ButtonRow label="Open" onClick={onOpen} />
  background={b}
</Section>
