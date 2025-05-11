<script lang="ts">
  import LucideCirclePlus from '$d2/icons/lucide--circle-plus.svelte';
  import type { VoidCallback } from '$d2/lib/base/utils/types';
  import Icon from './icon.svelte';

  let {
    onAdd,
    route,
  }: {
    route?: string;
    onAdd?: VoidCallback;
  } = $props();

  let onClick = () => {
    onAdd?.();
  };
</script>

<Icon icon={LucideCirclePlus} {route} {onClick} />
