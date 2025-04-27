<script lang="ts">
  import Section from '$d2/components/dark/section/section.svelte';
  import LucideSettings from '$d2/icons/lucide--settings.svelte';
  import type { Snippet } from 'svelte';

  let {
    children,
  }: {
    children: Snippet;
  } = $props();
</script>

<Section title="Settings" icon={LucideSettings}>
  {@render children()}
</Section>
