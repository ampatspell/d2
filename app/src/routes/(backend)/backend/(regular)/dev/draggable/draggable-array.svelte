<script lang="ts" module>
  import { Model } from '$d2/lib/base/model/model.svelte';
  import { createContext } from '$d2/lib/base/utils/context';
  import type { OptionsInput } from '$d2/lib/base/utils/options';

  export type DraggableContextOptions = {
    parent: DraggableContext | undefined;
  };

  export class DraggableContext extends Model<DraggableContextOptions> {}

  let { get: getDraggableContext, set: setDraggableContext } = createContext<DraggableContext>('draggable-array');

  export const createDraggableContext = (opts: OptionsInput<DraggableContextOptions>) => {
    const context = new DraggableContext(opts);
    setDraggableContext(context);
    return context;
  };

  export { getDraggableContext };
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let parent = getDraggableContext(false);
  let context = createDraggableContext({ parent });
</script>

<div class="draggable-array">
  {@render children()}
</div>

<style lang="scss">
  .draggable-array {
    display: contents;
  }
</style>
