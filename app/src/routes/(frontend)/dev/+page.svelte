<script lang="ts">
  import Dark from '$d2/components/dark/dark.svelte';
  import Page from '$d2/components/dark/section/page/page.svelte';
  import { options } from '$d2/lib/base/utils/options';
  import type { PageData } from './$types';
  import Link from './Link.svelte';
  import Markdown from './Markdown.svelte';
  import type { MarkdownDelegate } from './models.svelte';
  import Weirdo from './Weirdo.svelte';

  let { data }: { data: PageData } = $props();

  let input = $derived(data.input);
  let node = $derived(data.root);

  let delegate = options<MarkdownDelegate>({
    componentForElement: (element) => {
      const name = element.tagName;
      if (name === 'a') {
        return Link;
      } else if (name === 'weirdo') {
        return Weirdo;
      }
    },
  });
</script>

<Dark>
  <Page title="Dev">
    <div class="page">
      <div class="box input">{input}</div>
      <div class="box content">
        <Markdown {node} {delegate} />
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
