<script lang="ts">
  import LucideFoldVertical from '$d2/icons/lucide--fold-vertical.svelte';
  import Icon from './icon.svelte';

  let {
    onFold,
  }: {
    onFold: () => void;
  } = $props();

  let onClick = () => onFold();
</script>

<Icon icon={LucideFoldVertical} {onClick} />
