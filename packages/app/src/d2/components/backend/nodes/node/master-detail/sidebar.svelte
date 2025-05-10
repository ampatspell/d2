<script lang="ts">
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import Inspector from '$d2/components/dark/inspector/inspector.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import ValueRow from '$d2/components/dark/inspector/value-row.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';

  let { node }: { node: NodeDocumentModel } = $props();

  let identifier = $derived(node.properties.base.identifier);
</script>

<Overflow overflow="y">
  <Inspector>
    <Section>
      <ValueRow label="Kind" value={node.kind} />
    </Section>
    <Section>
      <InputRow label="Identifier" property={identifier} />
    </Section>
  </Inspector>
</Overflow>
