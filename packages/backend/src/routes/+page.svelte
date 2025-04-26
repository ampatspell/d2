<script lang="ts">
  import { PUBLIC_FIREBASE, PUBLIC_APP_NAME, PUBLIC_FIREBASE_REGION } from "$env/static/public";
  let config = JSON.parse(PUBLIC_FIREBASE);
</script>

<div class="page">
  backend for "{PUBLIC_APP_NAME}" {config.projectId} / {PUBLIC_FIREBASE_REGION}
</div>
