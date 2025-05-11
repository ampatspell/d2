<script lang="ts">
  import { getModalsContext } from '$d2/components/dark/modals/base/context.svelte';
  import Upload from '$d2/components/dark/section/page/upload.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
  import { openUploadFilesModal } from './node/upload/models.svelte';

  let { selected }: { selected: NodeDocumentModel | undefined } = $props();

  let modals = getModalsContext();
  let onUpload = () => {
    if (selected) {
      openUploadFilesModal(modals, {
        node: getter(() => selected),
      });
    }
  };
</script>

{#if selected?.exists}
  <Upload {onUpload} />
{/if}
