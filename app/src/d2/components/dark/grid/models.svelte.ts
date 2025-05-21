import { Model } from '$d2/lib/base/model/model.svelte';
import { createContext } from '$d2/lib/base/utils/context';
import type { OptionsInput } from '$d2/lib/base/utils/options';
import type { VoidCallback } from '$d2/lib/base/utils/types';
import type { DraggableOnDrop } from '../draggable/models.svelte';

export type GridModelDelegate = {
  isSelected: boolean;
  select: VoidCallback;
};

export type GridDelegate<T> = {
  isDraggable: boolean;
  models: T[];
  deselect: VoidCallback;
  delegateFor: (model: T) => GridModelDelegate;
  onDrop: (opts: DraggableOnDrop<T>) => void;
};

export type GridContextOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  models: any[];
  element: HTMLDivElement | undefined;
  width: number | undefined;
};

export class GridContext extends Model<GridContextOptions> {
  readonly models = $derived(this.options.models);
  readonly width = $derived(this.options.width);
  readonly gap = 6;

  readonly columns = $derived.by(() => {
    const width = this.width;
    if (width) {
      return Math.max(1, Math.floor(width / 150));
    }
  });

  readonly item = $derived.by(() => {
    const { width, columns, gap } = this;
    if (width && columns) {
      const w = width - gap * (columns - 1);
      const size = w / columns;
      return Math.floor(size);
    }
  });

  readonly size = $derived.by(() => {
    const { columns, item } = this;
    const items = this.models.length;
    if (columns && items && item) {
      const rows = Math.ceil(items / columns);
      const gap = this.gap;
      const scale = (value: number) => item * value + (value - 1) * gap;
      return {
        width: scale(columns),
        height: scale(rows),
      };
    }
  });
}

const { get: getGridContext, set: setGridContext } = createContext<GridContext>('grid');

export { getGridContext };

export const createGridContext = (opts: OptionsInput<GridContextOptions>) => {
  return setGridContext(new GridContext(opts));
};
