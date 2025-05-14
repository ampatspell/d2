<script lang="ts">
  import DraggableArray from "./draggable/draggable-array.svelte";
  import DraggableModel from "./draggable/draggable-model.svelte";

  class Entry {
    name = $state<string>()!;
    parent = $state<Entry>();
    constructor(name: string, parent: Entry | undefined) {
      this.name = name;
      this.parent = parent;
    }
  }

  let entries = $state<Entry[]>([]);
  let add = (entry: Entry) => {
    entries.push(entry);
    return entry;
  }

  let index = add(new Entry('index', undefined));
  {
    add(new Entry('image-1', index));
  }
  let gallery = add(new Entry('gallery', undefined));
  {
    for(let i = 0; i < 5; i++) {
      add(new Entry(`image-${i + 1}`, gallery));
    }
  }
</script>

<div class="dev">
  <div class="entries">
    <DraggableArray>
      {#each entries as entry (entry)}
        <DraggableModel model={entry}>
          <div class="entry">
            <div class="name">{entry.name}</div>
            <div class="parent">{entry.parent?.name ?? 'none'}</div>
          </div>
        </DraggableModel>
      {/each}
    </DraggableArray>
  </div>
</div>

<style lang="scss">
  .dev {
    padding: 10px;
    .entries {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
      .entry {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(255,0,0,0.1);
        padding: 5px;
        width: 75px;
        height: 75px;
      }
    }
  }
</style>
