<script lang="ts">
  import Button from '$d2/components/dark/button.svelte';
  import type { ModalRuntime } from '$d2/components/dark/modals/base/modal.svelte';
  import Actions from '$d2/components/dark/modals/modal/actions.svelte';
  import Header from '$d2/components/dark/modals/modal/header.svelte';
  import Modal from '$d2/components/dark/modals/modal/modal.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import { addObject, removeObject } from '$d2/lib/base/utils/array';
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesTreeSettings } from '../../tree/models.svelte';
  import Tree from '../../tree/tree.svelte';
  import type { SelectNodeModalProps, SelectNodeModalResolution } from './models.svelte';

  let { modal }: { modal: ModalRuntime<SelectNodeModalProps, SelectNodeModalResolution> } = $props();

  let title = $derived(modal.props.title);
  let nodes = $derived(modal.props.nodes);

  let selected = $state<NodeModel>();
  let onSelect = (model: NodeModel | undefined) => {
    selected = model;
  };

  let open = $state<string[]>([]);

  let settings: NodesTreeSettings = {
    isOpen: (id) => {
      return open.includes(id);
    },
    setOpen: (id, isOpen) => {
      if (isOpen) {
        addObject(open, id);
      } else {
        removeObject(open, id);
      }
    },
  };

  let onCancel = () => modal.dismiss();
  let onResolve = () => modal.resolve({ node: selected! });
</script>

<Modal size={{ width: 320, height: 400 }}>
  <Header {title} />
  <div class="content">
    <Overflow overflow="y">
      <Tree {nodes} {selected} {settings} {onSelect} />
    </Overflow>
  </div>
  <Actions>
    <Button label="Cancel" onClick={onCancel} />
    <Button label="Select" onClick={onResolve} isDisabled={!selected} />
  </Actions>
</Modal>

<style lang="scss">
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 -10px;
    border-top: 1px solid var(--dark-border-color-1);
    border-bottom: 1px solid var(--dark-border-color-1);
  }
</style>
