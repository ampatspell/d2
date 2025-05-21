<script lang="ts">
  import SelectNodeButton from '$d2/components/backend/nodes/select-button.svelte';
  import type { Property } from '$d2/lib/base/utils/property.svelte';
  import type { NodeModel } from '$d2/lib/nodes/node.svelte';
  import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
  import PropertyInput from '../property-input.svelte';
  import Column from './column.svelte';
  import Row from './row.svelte';

  let { label, property, nodes }: { label: string; property: Property<string>; nodes: NodesModel } = $props();

  let onSelect = (node: NodeModel) => property.update(node.path.value);
</script>

<Row>
  <Column {label} flex={true}>
    <div class="content">
      <PropertyInput {property} />
      <SelectNodeButton {nodes} {onSelect} />
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
