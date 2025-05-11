<script lang="ts">
  import LucideCirclePower from '$d2/icons/lucide--circle-power.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import { getSession } from '$d2/lib/session/session.svelte';
  import { getModalsContext } from '../../modals/base/context.svelte';
  import { relativeToBottomRight } from '../../modals/base/placement/relative-to/relative-to.svelte';
  import { withConfirmationModal } from '../../modals/confirmation/models';
  import Icon from './icon.svelte';

  let icon = $state<HTMLElement>();
  let modals = getModalsContext();
  let onClick = async () => {
    await withConfirmationModal(modals, {
      title: 'Sign out?',
      confirm: 'Sign out',
      placement: relativeToBottomRight({
        relativeTo: getter(() => icon),
        offset: { x: 0, y: 2 },
      }),
      onConfirmed: async () => {
        await getSession().signOut();
      },
    });
  };
</script>

<Icon bind:element={icon} icon={LucideCirclePower} {onClick} />
