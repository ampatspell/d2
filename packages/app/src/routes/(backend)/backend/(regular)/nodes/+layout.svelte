<script lang="ts">
  import Nodes from '$d2/components/backend/routes/nodes/nodes.svelte';
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
  import { setGlobal } from '$d2/lib/base/utils/set-global';
  import { isTruthy } from '$d2/lib/base/utils/array';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  let id = $derived(data.id);
  let nodes = $derived(data.nodes);
  let route = (node: NodeDocumentModel | undefined) => {
    return [`/backend/nodes`, node?.id].filter(isTruthy).join('/');
  };

  $effect(() => subscribe(nodes));
  $effect(() => setGlobal({ nodes }));
</script>

<Nodes {id} {nodes} {route}>
  {@render children()}
</Nodes>
