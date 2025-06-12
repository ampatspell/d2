<script lang="ts">
  import Button from '$d2/components/dark/button.svelte';
  import Children from './Children.svelte';
  import type { Element } from './models.svelte';

  let { node }: { node: Element } = $props();

  let clicks = $state(0);

  let onClick = () => {
    clicks++;
  };
</script>

<div class="weirdo">
  <div class="row">WEIRDO #{clicks} {node.properties.label}</div>
  <div class="row"><Button label="Click" {onClick} /></div>
  <div class="row"><Children {node} /></div>
</div>

<style lang="scss">
  .weirdo {
    background: rgba(255, 0, 0, 0.1);
    padding: 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
