<script lang="ts" module>
  export type FoldSate = 'fold' | 'unfold';
</script>

<script lang="ts">
  import LucideFoldVertical from '$d2/icons/lucide--fold-vertical.svelte';
  import LucideUnfoldVertical from '$d2/icons/lucide--unfold-vertical.svelte';
  import Icon from './icon.svelte';

  let {
    fold,
    onFold,
  }: {
    fold: FoldSate | undefined;
    onFold: (open: boolean) => void;
  } = $props();

  let onClick = () => onFold(fold === 'fold' ? false : true);
</script>

{#if fold}
  <Icon icon={fold === 'fold' ? LucideFoldVertical : LucideUnfoldVertical} {onClick} />
{/if}
