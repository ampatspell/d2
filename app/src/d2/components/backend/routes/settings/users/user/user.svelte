<script lang="ts">
  import type { UserRole } from '$d2-shared/documents';
  import Inspector from '$d2/components/dark/inspector/inspector.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import ValueRow from '$d2/components/dark/inspector/value-row.svelte';
  import { getModalsContext } from '$d2/components/dark/modals/base/context.svelte';
  import { relativeToBottomRight } from '$d2/components/dark/modals/base/placement/relative-to/relative-to.svelte';
  import { openConfirmationModal } from '$d2/components/dark/modals/confirmation/models';
  import Icon from '$d2/components/dark/section/page/icon.svelte';
  import Page from '$d2/components/dark/section/page/page.svelte';
  import LucideEyeOff from '$d2/icons/lucide--eye-off.svelte';
  import LucideEye from '$d2/icons/lucide--eye.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import type { UsersUserModel } from '$d2/lib/users/users.svelte';

  let { user }: { user: UsersUserModel } = $props();

  let icon = $state<HTMLElement>();
  let modals = getModalsContext();
  let setRole = (role: UserRole) => async () => {
    let confirmed = await openConfirmationModal(modals, {
      title: `Make this user "${role}"?`,
      confirm: 'Yes',
      placement: relativeToBottomRight({
        relativeTo: getter(() => icon),
        offset: { x: 0, y: 2 },
      }),
    });
    if (confirmed) {
      await user.setRole(role);
    }
  };

  let title = $derived.by(() => {
    let email = user.email;
    if (user.isMe) {
      return `${email} (me)`;
    }
    return email;
  });
</script>

{#snippet actions()}
  {#if !user.isMe}
    {#if user.role === 'admin'}
      <Icon icon={LucideEyeOff} onClick={setRole('visitor')} bind:element={icon} />
    {:else if user.role === 'visitor'}
      <Icon icon={LucideEye} onClick={setRole('admin')} bind:element={icon} />
    {/if}
  {/if}
{/snippet}

<Page {title} {actions}>
  <Inspector>
    <Section>
      <ValueRow label="Email" value={user.email} />
      <ValueRow label="Role" value={user.role} />
    </Section>
  </Inspector>
</Page>
