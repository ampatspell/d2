<script lang="ts">
  import Page from '$d2/components/dark/section/page/page.svelte';
  import Section from '$d2/components/dark/section/section.svelte';
  import LucideSettings from '$d2/icons/lucide--settings.svelte';
  import { subscribe } from '$d2/lib/base/refactoring/subscribable.svelte';
  import { ItemsModel } from './models.svelte';

  let items = new ItemsModel(undefined);
  $effect(() => subscribe(items));
</script>

<Section title="Dev" icon={LucideSettings}>
  <Page title="Dev">
    <div class="rows">
      {#each items.models.content as model}
        <div class="row">{model.id} - {model.query.content}</div>
      {/each}
    </div>
  </Page>
</Section>

<style lang="scss">
  .rows {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
