<script lang="ts">
  import Nodes from '$d2/components/backend/routes/nodes/nodes.svelte';
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import { isTruthy } from '$d2/lib/base/utils/array';
  import { page } from '$app/state';
  import type { NodeModel } from '$d2/lib/nodes/node/node.svelte';
  import { subscribe } from '$d2/lib/base/refactoring/subscribable.svelte';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  let id = $derived(page.params.id);
  let nodes = $derived(data.nodes);
  let settings = $derived(data.settings);

  let route = (node: NodeModel | undefined) => {
    return [`/backend/nodes`, node?.id].filter(isTruthy).join('/');
  };

  $effect(() => subscribe(nodes));
  $effect(() => subscribe(settings));
</script>

<Nodes {id} {nodes} {settings} {route}>
  {@render children()}
</Nodes>
