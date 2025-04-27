<script lang="ts">
  import Add from '$d2/components/dark/section/page/add.svelte';
  import Page from '$d2/components/dark/section/page/page.svelte';

  let onAdd = () => {};
</script>

{#snippet actions()}
  <Add {onAdd} />
{/snippet}

<Page title="Nodes" {actions} />
