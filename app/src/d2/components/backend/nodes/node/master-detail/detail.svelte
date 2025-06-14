<script lang="ts">
  import { dev } from '$app/environment';
  import Icon from '$d2/components/dark/icon.svelte';
  import Column from '$d2/components/dark/inspector/column.svelte';
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import Inspector from '$d2/components/dark/inspector/inspector.svelte';
  import PathRow from '$d2/components/dark/inspector/path-row.svelte';
  import Row from '$d2/components/dark/inspector/row.svelte';
  import Section from '$d2/components/dark/inspector/section.svelte';
  import ValueRow from '$d2/components/dark/inspector/value-row.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import LucideFileTerminal from '$d2/icons/lucide--file-terminal.svelte';
  import { formatDate } from '$d2/lib/base/utils/date';
  import { setGlobal } from '$d2/lib/base/utils/set-global';
  import type { NodeModel } from '$d2/lib/nodes/node/node.svelte';

  let { node }: { node: NodeModel } = $props();

  let identifier = $derived(node.properties.base.identifier);
  let createdAt = $derived(formatDate(node.createdAt, 'medium', 'short'));
  let updatedAt = $derived(formatDate(node.updatedAt, 'medium', 'short'));

  let onSetGlobal = () => {
    setGlobal({ node });
  };
</script>

<Overflow overflow="y">
  <Inspector>
    <Section>
      <ValueRow label="Type" value={node.name} />
      <PathRow label="Path" value={node.path.value} />
      <ValueRow label="Created" value={createdAt} />
      <ValueRow label="Updated" value={updatedAt} />
    </Section>
    <Section>
      <InputRow label="Identifier" property={identifier} />
    </Section>
    {#if dev}
      <Section>
        <Row>
          <Column>
            <Icon icon={LucideFileTerminal} onClick={onSetGlobal} />
          </Column>
        </Row>
      </Section>
    {/if}
  </Inspector>
</Overflow>
