<script lang="ts">
    import type { TreeModelDelegate } from "$d2/components/dark/tree.svelte";
    import Tree from "$d2/components/dark/tree.svelte";
  import { getter, options } from "$d2/lib/base/utils/options";

  class Model {
    name = $state<string>()!;
    items = $state<Model[]>()!;
    isOpen = $state(false);

    constructor(name: string, items?: Model[]) {
      this.name = name;
      this.items = items ?? [];
    }

    add(model: Model) {
      this.items.push(model);
    }

    static create(name: string) {
      return new this(name);
    }
  }

  let frontend = Model.create('Frontend');
  {
    let image = Model.create('film-990-10');
    frontend.add(image);
  }
  let index = Model.create('Index');
  {
    let images = Model.create('Images');
    {
      images.add(Model.create('film-100-1'));
      images.add(Model.create('film-100-2'));
      images.add(Model.create('film-100-3'));
    }
    index.add(images);
  }

  let models = [frontend, index];
  let selected = $state<Model>();

  let delegateFor = (model: Model) => options<TreeModelDelegate<Model>>({
    children: getter(() => model.items),
    isOpen: getter(() => model.isOpen),
    setOpen: (open: boolean) => model.isOpen = open,
    isSelected: getter(() => selected === model),
    select: () => selected = model,
  });

  let deselect = () => selected = undefined;
</script>

{#snippet item(item: Model)}
  {item.name}
{/snippet}

<div class="dev">
  <div class="tree">
    <Tree {models} {delegateFor} {deselect} {item} />
  </div>
</div>

<style lang="scss">
  .dev {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    > .tree {
      border: 1px solid var(--dark-border-color-1);
      flex: 1;
      width: 300px;
      display: flex;
      flex-direction: column;
    }
  }
</style>
