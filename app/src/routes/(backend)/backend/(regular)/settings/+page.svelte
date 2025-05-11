<script lang="ts">
  import Page from '$d2/components/dark/section/page/page.svelte';
  import SignOut from '$d2/components/dark/section/page/sign-out.svelte';
</script>

{#snippet actions()}
  <SignOut />
{/snippet}

<Page title="Settings" {actions} />
