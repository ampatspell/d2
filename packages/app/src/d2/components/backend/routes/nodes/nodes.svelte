<script lang="ts">
  import Section from '$d2/components/dark/section/section.svelte';
  import LucideFile from '$d2/icons/lucide--file.svelte';
  import type { Snippet } from 'svelte';

  let {
    children,
  }: {
    children: Snippet;
  } = $props();
</script>

<Section title="Nodes" icon={LucideFile}>
  {@render children()}
</Section>
