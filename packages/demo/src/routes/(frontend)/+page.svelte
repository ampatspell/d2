<script lang="ts">
  import { PUBLIC_FIREBASE, PUBLIC_APP_NAME } from "$env/static/public";
  let config = JSON.parse(PUBLIC_FIREBASE);
</script>

<div class="page">
  <div class="row">
    {PUBLIC_APP_NAME} / {config.projectId}
  </div>
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
