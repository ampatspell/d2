<script lang="ts">
  import LucideUser from '$d2/icons/lucide--user.svelte';
  import Section from '$d2/components/dark/section/section.svelte';
  import Me from '$d2/components/backend/routes/settings/me/me.svelte';
</script>

<Section title="Me" icon={LucideUser}>
  <Me />
</Section>
