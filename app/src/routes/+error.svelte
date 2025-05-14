<script lang="ts">
  import { page } from '$app/state';
  import Layout from '$d2/components/layout.svelte';
  import Dark from '$d2/components/dark/dark.svelte';
</script>

<Layout>
  <Dark>
    <div class="content">
      {page.status}
      {page.error?.message}
    </div>
  </Dark>
</Layout>

<style lang="scss">
  .content {
    padding: 10px;
  }
</style>
