<script lang="ts">
  import SignOut from '$d2/components/dark/section/page/sign-out.svelte';
  import Page from '$d2/components/dark/section/page/page.svelte';
  import LucideUser from '$d2/icons/lucide--user.svelte';
  import Section from '$d2/components/dark/section/section.svelte';
</script>

{#snippet actions()}
  <SignOut />
{/snippet}

<Section title="Me" icon={LucideUser}>
  <Page title="Me" {actions} />
</Section>
