<script lang="ts">
  import Content from './content.svelte';
  import type { Modal } from './modal.svelte';

  let { modal }: { modal: Modal } = $props();

  let element = $state<HTMLDivElement>();
  let onmousedown = (e: Event) => {
    if (e.target === element) {
      e.preventDefault();
    }
  };
  let onclick = (e: Event) => {
    if (e.target === element) {
      modal.dismiss();
    }
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal" bind:this={element} {onmousedown} {onclick}>
  <Content {modal} />
</div>

<style lang="scss">
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
