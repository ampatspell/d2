<script lang="ts">
  import Section from '$d2/components/dark/section/section.svelte';
  import LucideActivity from '$d2/icons/lucide--activity.svelte';
  import type { Snippet } from 'svelte';

  let {
    children,
  }: {
    children: Snippet;
  } = $props();
</script>

<Section title="Dashboard" icon={LucideActivity}>
  {@render children()}
</Section>
