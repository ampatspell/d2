<script lang="ts">
  import { getActiveInputElement } from '$d2/lib/base/utils/dom';
  import Container from './container.svelte';
  import { getModalsContext } from './context.svelte';

  let context = getModalsContext();
  let modals = $derived(context.modals);
  let last = $derived(context.last);

  let onkeyup = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !e.shiftKey && !getActiveInputElement()) {
      last?.dismiss();
    }
  };
</script>

<svelte:window {onkeyup} />

{#each modals as modal (modal)}
  <Container {modal} />
{/each}
