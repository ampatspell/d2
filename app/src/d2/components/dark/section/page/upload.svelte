<script lang="ts">
  import LucideFileUp from '$d2/icons/lucide--file-up.svelte';
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import Icon from './icon.svelte';

  let {
    onUpload,
  }: {
    onUpload?: VoidCallback;
  } = $props();

  let onClick = () => onUpload?.();
</script>

<Icon icon={LucideFileUp} {onClick} />
