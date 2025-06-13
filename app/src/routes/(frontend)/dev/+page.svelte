<script lang="ts">
  import Dark from '$d2/components/dark/dark.svelte';
  import Page from '$d2/components/dark/section/page/page.svelte';
  import Markdown from '$d2/components/markdown/Markdown.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let input = $derived(data.input);
  let node = $derived(data.root);
</script>

<Dark>
  <Page title="Dev">
    <div class="page">
      <div class="box input">{input}</div>
      <div class="box content">
        <Markdown {node} />
      </div>
    </div>
  </Page>
</Dark>

<style lang="scss">
  .page {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    > .box {
      border: 1px solid #eee;
      padding: 5px;
      border-radius: 3px;
    }
    > .input {
      white-space: pre-wrap;
    }
  }
</style>
