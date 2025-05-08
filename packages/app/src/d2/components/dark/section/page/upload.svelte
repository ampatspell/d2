<script lang="ts">
  import LucideCloudUpload from '$d2/icons/lucide--cloud-upload.svelte';
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import Icon from './icon.svelte';

  let {
    onUpload,
  }: {
    onUpload?: VoidCallback;
  } = $props();

  let onClick = () => onUpload?.();
</script>

<Icon icon={LucideCloudUpload} {onClick} />
