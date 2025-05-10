<script lang="ts">
    import type { ImageFileNodeProperties } from '$d2-shared/nodes';
  import { subscribe } from '$d2/lib/base/model/subscriber.svelte';
    import type { FileNodeDocumentModel } from '$lib/file/node.svelte';
  import type { MissingNodeDocumentModel } from '$lib/missing/node.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let foofNode = $derived(data.foof);
  let imageNode = $derived(data.image);

  let foof = $derived(foofNode.node as MissingNodeDocumentModel | undefined);
  let image = $derived(imageNode.node as FileNodeDocumentModel | undefined);
  let url = $derived.by(() => {
    let properties = image?.data.properties as ImageFileNodeProperties | undefined;
    return properties?.thumbnails['1024x1024'].url;
  });

  $effect(() => subscribe(foofNode));
  $effect(() => subscribe(imageNode));
</script>

<div class="page">
  <div class="row">
    {foof?.data.properties.message ?? `Node not found`}
  </div>
  {#if url}
    <div class="row">
      <!-- svelte-ignore a11y_missing_attribute -->
      <img src={url} />
    </div>
  {/if}
  <div class="row">
    <a href="/backend">backend</a>
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    justify-content: center;
    padding: 50px;
  }
</style>
