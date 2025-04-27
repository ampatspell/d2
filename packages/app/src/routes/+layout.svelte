<script lang="ts">
  import { firebase } from "$d2/lib/base/fire/firebase.svelte";
  import { stats } from "$d2/lib/base/fire/stats.svelte";
  import { stats as models } from "$d2/lib/base/model/stats.svelte";
  import { setGlobal } from "$d2/lib/base/utils/set-global";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
  setGlobal({ firebase, stats, models });
</script>

{@render children()}
