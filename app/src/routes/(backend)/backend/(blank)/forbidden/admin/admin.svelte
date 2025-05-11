<script lang="ts">
  import Icon from '$d2/components/dark/icon.svelte';
  import { getModalsContext } from '$d2/components/dark/modals/base/context.svelte';
  import LucideSquareCode from '$d2/icons/lucide--square-code.svelte';
  import Modal from './modal.svelte';

  let modals = getModalsContext();

  let isOpen = $state(false);
  let onClick = async () => {
    isOpen = true;
    await modals.open({
      component: Modal,
      props: {},
      cancel: {},
    });
    isOpen = false;
  };
</script>

<div class="admin" class:is-open={isOpen}>
  <Icon icon={LucideSquareCode} {onClick} />
</div>

<style lang="scss">
  @use 'sass:color';
  .admin {
    position: fixed;
    bottom: 5px;
    left: 5px;
    color: color.adjust(#000, $alpha: -0.2);
    opacity: 0;
    transition: 0.15s ease-in-out opacity;
    &:hover,
    &.is-open {
      opacity: 1;
    }
  }
</style>
