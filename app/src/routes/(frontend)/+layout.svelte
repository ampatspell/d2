<script lang="ts">
  import Layout from '$d2/components/layout.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let fonts = ['https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap'];
</script>

<svelte:head>
  <title>d2 app</title>
</svelte:head>

<Layout {fonts}>
  <div class="frontend">
    {@render children()}
  </div>
</Layout>

<style lang="scss">
  .frontend {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-family: 'Raleway', sans-serif;
    font-size: 13px;
    font-weight: 400;
    cursor: default;
  }
</style>
