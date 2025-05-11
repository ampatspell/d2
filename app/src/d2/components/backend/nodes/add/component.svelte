<script lang="ts">
  import Button from '$d2/components/dark/button.svelte';
  import type { ModalRuntime } from '$d2/components/dark/modals/base/modal.svelte';
  import Actions from '$d2/components/dark/modals/modal/actions.svelte';
  import Header from '$d2/components/dark/modals/modal/header.svelte';
  import Modal from '$d2/components/dark/modals/modal/modal.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import Cell from '$d2/components/dark/table/cell.svelte';
  import Table from '$d2/components/dark/table/table.svelte';
  import { getDefinition } from '$d2/lib/definition/app.svelte';
  import type { NodeDefinitionModel } from '$d2/lib/definition/node.svelte';
  import type { SelectNodeDefinitionModalProps, SelectNodeDefinitionModalResolution } from './models.svelte';

  let { modal }: { modal: ModalRuntime<SelectNodeDefinitionModalProps, SelectNodeDefinitionModalResolution> } =
    $props();

  let parent = $derived(modal.props.parent);

  let definition = getDefinition();
  let definitions = $derived(definition.nodesWithDefaults);

  let onClick = (definition: NodeDefinitionModel) => () => {
    modal.resolve({
      parent,
      definition,
    });
  };

  let onCancel = () => modal.dismiss();
</script>

<Modal size={{ width: 500, height: 400 }}>
  <Header title="Add node" />
  <div class="table">
    <Overflow overflow="y">
      <Table>
        {#each definitions as definition (definition)}
          <Cell onClick={onClick(definition)}>
            {definition.name}
          </Cell>
        {/each}
      </Table>
    </Overflow>
  </div>
  <Actions>
    <Button label="Cancel" onClick={onCancel} />
  </Actions>
</Modal>

<style lang="scss">
  .table {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 -10px;
    border-top: 1px solid var(--dark-border-color-1);
    border-bottom: 1px solid var(--dark-border-color-1);
  }
</style>
