<script lang="ts">
  import Markdown from '$d2/components/markdown/Markdown.svelte';
  import type { IndexNodeModel } from '$lib/definition/index/node.svelte';

  let { index }: { index: IndexNodeModel } = $props();

  let background = $derived(index.details.background);
  let url = $derived(background?.thumbnails['2048x2048'].url);
  let introduction = $derived(index.details.introduction);
</script>

<svelte:head>
  <meta content={index.title} property="og:title" />
</svelte:head>

<div class="page">
  {#if url}
    <div class="image" style:--url="url({url})"></div>
  {/if}
  <div class="title">{index.title}</div>
  <div class="markdown">
    <Markdown node={introduction} />
  </div>
  <div class="links">
    {#each index.links as link (link)}
      <a href={link.path}>{link.label}</a>
    {/each}
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    > .image {
      position: fixed;
      z-index: -1;
      $o: -50px;
      top: $o;
      left: $o;
      bottom: $o;
      right: $o;
      background-color: #222;
      background-position: center center;
      background-repeat: no-repeat;
      background-image: var(--url);
      background-size: cover;
    }
    > .title {
      font-size: 21px;
      font-weight: 500;
      color: #fff;
    }
    > .links {
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 16px;
      font-weight: 500;
      color: #fff;
      > a {
        text-decoration: none;
      }
    }
    > .markdown {
      color: #fff;
    }
  }
</style>
