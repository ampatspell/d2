<script lang="ts">
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import Inspector from '$d2/components/dark/inspector/inspector.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import ValueRow from '$d2/components/dark/inspector/value-row.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import { formatDate } from '$d2/lib/base/utils/date';
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';

  let { node }: { node: NodeDocumentModel } = $props();

  let identifier = $derived(node.properties.base.identifier);
  let createdAt = $derived(formatDate(node.createdAt, 'medium', 'short'));
  let updatedAt = $derived(formatDate(node.updatedAt, 'medium', 'short'));
</script>

<Overflow overflow="y">
  <Inspector>
    <Section>
      <ValueRow label="Type" value={node.name} />
      <ValueRow label="Path" value={node.path} />
      <ValueRow label="Created" value={createdAt} />
      {#if createdAt !== updatedAt}
        <ValueRow label="Updated" value={updatedAt} />
      {/if}
    </Section>
    <Section>
      <InputRow label="Identifier" property={identifier} />
    </Section>
  </Inspector>
</Overflow>
