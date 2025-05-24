<script lang="ts">
  let { data }: { data: unknown } = $props();
</script>

<div class="json">{JSON.stringify(data, null, 2)}</div>

<style lang="scss">
  .json {
    white-space: pre-wrap;
  }
</style>
