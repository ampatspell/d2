<script lang="ts">
  import Page from '$d2/components/dark/section/page/page.svelte';
    import { toContent } from './models.svelte';

  const thing = async () => {
    const content = await toContent('# Hello\nworld <foo/>');
    console.log(content);
  }

  thing();
</script>

<Page title="Dev">
  <div class="page">Hello</div>
</Page>

<style lang="scss">
  .page {
    padding: 10px;
  }
</style>
