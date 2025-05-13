<script lang="ts">
  import Section from '$d2/components/dark/section/section.svelte';
  import LucideUsers from '$d2/icons/lucide--users.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<Section title="Users" icon={LucideUsers}>
  {#snippet sidebar()}
    Users list
  {/snippet}
  {@render children()}
</Section>
