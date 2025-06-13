<script lang="ts">
  import { serializedToString } from '$d2/lib/base/utils/object';
  import type { MarkdownElement } from '$d2/lib/markdown/tree';

  let { node }: { node: MarkdownElement } = $props();
  let model = $derived(node.model);
  let Component = $derived(model?.component);
</script>

{#if model && Component}
  <Component {model} />
{:else}
  {`<${[node.name, serializedToString(node.attributes)].join(' ')} />`}
{/if}
