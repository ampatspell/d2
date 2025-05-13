<script lang="ts">
  import Inspector from '$d2/components/dark/inspector/inspector.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import ValueRow from '$d2/components/dark/inspector/value-row.svelte';
  import Page from '$d2/components/dark/section/page/page.svelte';
  import SignOut from '$d2/components/dark/section/page/sign-out.svelte';
  import { getSession } from '$d2/lib/session/session.svelte';

  let session = getSession();
  let user = $derived(session.user);
</script>

{#if user}
  {#snippet actions()}
    <SignOut />
  {/snippet}

  <Page title="Me" {actions}>
    <Inspector>
      <Section>
        <ValueRow label="Email" value={user.email} />
        <ValueRow label="Role" value={user.role} />
      </Section>
    </Inspector>
  </Page>
{/if}
