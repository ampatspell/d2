<script lang="ts">
  import { getMarkdownContext, type MarkdownElement } from './models.svelte';
  import { serializedToString } from '$d2/lib/base/utils/object';

  let { node }: { node: MarkdownElement } = $props();
  let context = getMarkdownContext();
  let Component = $derived(context.componentForElement(node));
</script>

{#if Component}
  <Component {node} />
{:else}
  {`<${[node.name, serializedToString(node.attributes)].join(' ')} />`}
{/if}
