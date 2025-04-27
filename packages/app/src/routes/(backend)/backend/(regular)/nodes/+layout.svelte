<script lang="ts">
  import Nodes from '$d2/components/backend/routes/nodes/nodes.svelte';
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
  import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
    import { setGlobal } from '$d2/lib/base/utils/set-global';

  let { data, children }: { data: LayoutData, children: Snippet } = $props();

  let id = $derived(data.id);
  let nodes = $derived(data.nodes);
  let route = (node: NodeDocumentModel<never>) => `/backend/nodes/${node.id}`;

  $effect(() => subscribe(nodes));

  setGlobal({ nodes });
</script>

<Nodes {id} {nodes} {route}>
  {@render children()}
</Nodes>
