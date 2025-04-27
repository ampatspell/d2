<script lang="ts" generics="T">
    import { classes } from '$d2/lib/base/utils/classes';
  import type { Snippet } from 'svelte';

  let {
    models,
    item,
    children,
  }: {
    models: T[];
    item: Snippet<[T]>;
    children: (model: T) => T[];
  } = $props();

  class Group {
    element = $state<HTMLDivElement>();
    over = $state(false);

    onMouseOver(e: Event) {
      e.stopPropagation();
      this.over = true;
    }
    onMouseOut(e: Event) {
      e.stopPropagation();
      this.over = false;
    }
  }
</script>

{#snippet group(model: T, level: number)}
{@const group = new Group()}
  <!-- svelte-ignore a11y_mouse_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="group" class:over={group.over} bind:this={group.element} onmouseover={(e) => group.onMouseOver(e)} onmouseout={(e) => group.onMouseOut(e)}>
    <div class="item" style:--offset="{level * 10}px">
      {@render item(model)}
    </div>
    {@render array(children(model), level + 1)}
  </div>
{/snippet}

{#snippet array(models: T[], level: number)}
  {#each models as model (model)}
    {@render group(model, level)}
  {/each}
{/snippet}

<div class="tree">
  {@render array(models, 0)}
</div>

<style lang="scss">
  .tree {
    display: flex;
    flex-direction: column;
    user-select: none;
  }
  .group {
    &.over {
      background: #eee;
    }
    > .item {
      padding: 5px 10px 5px calc(10px + var(--offset));
      border-bottom: 1px solid #eee;
    }
  }
</style>
