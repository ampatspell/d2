<script lang="ts">
  import { PUBLIC_APP_NAME, PUBLIC_FIREBASE } from "$env/static/public";

  const config = JSON.parse(PUBLIC_FIREBASE) as any;
  const name = PUBLIC_APP_NAME
</script>

{name} / {config.projectId}
