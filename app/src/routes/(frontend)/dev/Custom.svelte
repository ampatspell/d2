<script lang="ts">
  import type { Node } from 'mdast';
  import { getMarkdownContext, type Element } from './models.svelte';
  import { serializedToString } from '$d2/lib/base/utils/object';

  let { node }: { node: Node } = $props();
  let element = $derived(node as Element);
  let context = getMarkdownContext();
  let Component = $derived(context.componentForElement(element));
</script>

{#if Component}
  <Component node={element} />
{:else}
  {`<${[element.tagName, serializedToString(element.properties)].join(' ')} />`}
{/if}
