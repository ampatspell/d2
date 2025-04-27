<script lang="ts">
  import Tree from "./tree/tree.svelte";

  class Model {
    name = $state<string>()!;
    items = $state<Model[]>()!;

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

  let items = [frontend, index];
  let children = (model: Model) => model.items;
</script>

{#snippet item(item: Model)}
  {item.name}
{/snippet}

<div class="dev">
  <div class="tree">
    <Tree models={items} {item} {children} />
  </div>
</div>

<style lang="scss">
  .dev {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    > .tree {
      border: 1px solid #eee;
      flex: 1;
      width: 200px;
    }
  }
</style>
