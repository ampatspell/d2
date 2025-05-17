import { Model } from '$d2/lib/base/model/model.svelte';
import { addObject, removeObject } from '$d2/lib/base/utils/array';
import { createContext } from '$d2/lib/base/utils/context';
import type { OptionsInput } from '$d2/lib/base/utils/options';
import type { Point } from '$d2/lib/base/utils/types';
import { untrack } from 'svelte';

export type Over = 'item' | 'before' | 'after';
export type Direction = 'horizontal' | 'vertical';

export type DraggableDelegate = {
  isDraggable: boolean;
  onDragging: (model: unknown | undefined) => void;
  isValidTarget: (model: unknown) => boolean;
};

const eventToClientPoint = (e: MouseEvent): Point => {
  const x = e.clientX;
  const y = e.clientY;
  return { x, y };
};

const distance = (a: Point, b: Point) => {
  const forKey = (key: keyof Point) => Math.abs(a[key] - b[key]);
  return Math.max(forKey('x'), forKey('y'));
};

export type DraggingModelOptions = {
  context: DraggableContext;
  draggable: DraggableModel;
};

export class DraggingModel extends Model<DraggingModelOptions> {
  readonly context = $derived(this.options.context);
  readonly draggable = $derived(this.options.draggable);
  readonly rect = $derived(this.draggable.rect);
  readonly model = $derived(this.draggable.model);

  private phase = $state<'preflight' | 'dragging'>('preflight');
  readonly isDragging = $derived(this.phase === 'dragging');

  private down?: Point;
  private offset?: Point;
  private mouse = $state<Point>();

  readonly point = $derived.by(() => {
    const { mouse, offset } = this;
    const calc = (key: keyof Point) => mouse![key] - offset![key];
    return {
      x: calc('x'),
      y: calc('y'),
    };
  });

  onMouseDown(e: MouseEvent) {
    const down = eventToClientPoint(e);
    this.down = down;
    this.mouse = down;
    const rect = this.rect;
    if (rect) {
      this.offset = {
        x: down.x - rect.x,
        y: down.y - rect.y,
      };
    }
  }

  onMouseMove(e: MouseEvent) {
    e.preventDefault();
    const point = eventToClientPoint(e);
    this.mouse = point;
    if (this.phase === 'preflight') {
      if (distance(this.down!, point) > 5) {
        this.phase = 'dragging';
        this.context.onDragStart(this);
      }
    }
  }

  onMouseUp(e: MouseEvent) {
    e.preventDefault();
  }

  over(model: DraggableModel): Over | undefined {
    if (!this.draggable.canDrop(model)) {
      return undefined;
    }

    const mouse = this.mouse;
    const rect = model.rect;
    if (mouse && rect) {
      const calc = (p: 'x' | 'y', s: 'width' | 'height') => {
        return mouse[p] > rect[p] && mouse[p] <= rect[p] + rect[s];
      };
      const x = calc('x', 'width');
      const y = calc('y', 'height');
      if (x && y) {
        const offset = 10;
        const position = mouse.y - rect.y;
        if (position < offset) {
          return 'before';
        }
        if (position > rect.height - offset) {
          return 'after';
        }
        return 'item';
      }
    }
    return undefined;
  }

  static onMouseDown(context: DraggableContext, draggable: DraggableModel, e: MouseEvent) {
    const model = new this({ context, draggable });
    model.onMouseDown(e);
    return model;
  }
}

export type DraggableModelOptions = {
  context: DraggableContext;
  element: HTMLDivElement | undefined;
  model: unknown;
};

export class DraggableModel extends Model<DraggableModelOptions> {
  readonly context = $derived(this.options.context);
  readonly element = $derived(this.options.element);
  readonly model = $derived(this.options.model);

  readonly rect = $derived.by(() => {
    const element = this?.element;
    if (element) {
      const { top, left, width, height } = element.getBoundingClientRect();
      return {
        x: left,
        y: top,
        width,
        height,
      };
    }
  });

  readonly dragging = $derived(this.context.draggingFor(this));
  readonly over = $derived.by(() => this.context.dragging?.over(this));

  onMouseDown(e: MouseEvent) {
    this.context.onMouseDown(this, e);
  }

  canDrop(draggable: DraggableModel) {
    return this.context.delegate.isValidTarget(draggable.model);
  }
}

export type DraggableContextOptions = {
  delegate: DraggableDelegate;
};

export class DraggableContext extends Model<DraggableContextOptions> {
  readonly delegate = $derived(this.options.delegate);
  readonly isDraggable: boolean = $derived(this.delegate.isDraggable);

  private registered = $state<DraggableModel[]>([]);
  dragging = $state<DraggingModel>();

  readonly over = $derived.by(() => {
    if (this.dragging?.isDragging) {
      return this.registered.filter((model) => !!model.over);
    }
    return [];
  });

  draggingFor(draggable: DraggableModel) {
    const dragging = this.dragging;
    if (dragging?.draggable === draggable && dragging.isDragging) {
      return dragging;
    }
  }

  register(draggable: DraggableModel) {
    untrack(() => addObject(this.registered, draggable));
    return () => {
      untrack(() => removeObject(this.registered, draggable));
    };
  }

  onMouseDown(draggable: DraggableModel, e: MouseEvent) {
    if (this.isDraggable) {
      this.dragging = DraggingModel.onMouseDown(this, draggable, e);
    }
  }

  onMouseMove(e: MouseEvent) {
    this.dragging?.onMouseMove(e);
  }

  onMouseUp(e: MouseEvent) {
    const dragging = this.dragging;
    if (dragging) {
      dragging.onMouseUp(e);
      this.onDragEnd();
      this.dragging = undefined;
    }
  }

  onDragStart(dragging: DraggingModel) {
    this.delegate.onDragging(dragging.model);
  }

  onDragEnd() {
    this.delegate.onDragging(undefined);
  }
}

const { get: getDraggableContext, set: setDraggableContext } = createContext<DraggableContext>('draggable');

export const createDraggableContext = (opts: OptionsInput<DraggableContextOptions>) => {
  const context = new DraggableContext(opts);
  setDraggableContext(context);
  return context;
};

export { getDraggableContext };
