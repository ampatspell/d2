<script lang="ts">
  import { openSelectNodeModal } from '$d2/components/backend/nodes/node/select/models.svelte';
  import { getter } from '$d2/lib/base/utils/options';
  import type { Property } from '$d2/lib/base/utils/property.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import Button from '../button.svelte';
  import { getModalsContext } from '../modals/base/context.svelte';
  import { relativeToBottomRight } from '../modals/base/placement/relative-to/relative-to.svelte';
  import PropertyInput from '../property-input.svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';

  let { label, property, nodes }: { label: string; property: Property<string>; nodes: NodesModel } = $props();

  let modals = getModalsContext();
  let button = $state<HTMLButtonElement>();
  let onClick = async () => {
    let res = await openSelectNodeModal(modals, {
      nodes: getter(() => nodes),
      title: 'Select node',
      placement: relativeToBottomRight({
        relativeTo: button,
        offset: {
          x: 0,
          y: 3,
        },
      }),
    });
    if (res) {
      property.update(res.node.path.value);
    }
  };
</script>

<Row>
  <Column {label} flex={true}>
    <div class="content">
      <PropertyInput {property} />
      <Button label="Select node" {onClick} bind:element={button} />
    </div>
  </Column>
</Row>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
</style>
