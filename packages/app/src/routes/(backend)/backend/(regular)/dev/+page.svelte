<script lang="ts">
  import Inspector from '$d2/components/dark/inspector/inspector.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import Section from '$d2/components/dark/section/section.svelte';
  import InspectorSection from '$d2/components/dark/inspector/section.svelte';
  import LucideFileTerminal from '$d2/icons/lucide--file-terminal.svelte';
  import Header from '$d2/components/dark/inspector/header.svelte';
  import InputRow from '$d2/components/dark/inspector/input-row.svelte';
  import { Property } from '$d2/lib/base/utils/property.svelte';
  import { getter } from '$d2/lib/base/utils/options';

  let value = $state('hello');

  let name = new Property<string>({
    value: getter(() => value),
    update: (next) => {
      console.log('update');
      value = next;
    },
    didUpdate: () => {
      console.log('didUpdate');
    },
  });
</script>

<Section title="Dev" icon={LucideFileTerminal}>
  <Overflow overflow="y">
    <Inspector>
      <InspectorSection>
        <Header title="Hello" />
      </InspectorSection>
      <InspectorSection>
        <InputRow label="Name" property={name} />
      </InspectorSection>
    </Inspector>
  </Overflow>
</Section>
