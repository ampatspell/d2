import { Model } from '$d2/lib/base/model/model.svelte';
import { createContext } from '$d2/lib/base/utils/context';
import type { OptionsInput } from '$d2/lib/base/utils/options';
import type { Point } from '$d2/lib/base/utils/types';

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
  readonly element = $derived(this.draggable.element);

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
    const rect = this.element?.getBoundingClientRect();
    if (rect) {
      console.log(rect);
      this.offset = {
        x: down.x - rect.left,
        y: down.y - rect.top,
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
      }
    }
  }

  onMouseUp(e: MouseEvent) {
    e.preventDefault();
  }

  static onMouseDown(context: DraggableContext, draggable: DraggableModel, e: MouseEvent) {
    const model = new this({ context, draggable });
    model.onMouseDown(e);
    return model;
  }
}

export type DraggableContextOptions = {
  isDraggable?: boolean;
};

export class DraggableContext extends Model<DraggableContextOptions> {
  readonly isDraggable: boolean = $derived(this.options.isDraggable ?? true);
  private dragging = $state<DraggingModel>();

  draggingFor(draggable: DraggableModel) {
    const dragging = this.dragging;
    if (dragging?.draggable === draggable && dragging.isDragging) {
      return dragging;
    }
  }

  onMouseDown(draggable: DraggableModel, e: MouseEvent) {
    if (this.isDraggable) {
      e.preventDefault();
      this.dragging = DraggingModel.onMouseDown(this, draggable, e);
    }
  }

  onMouseMove(e: MouseEvent) {
    this?.dragging?.onMouseMove(e);
  }

  onMouseUp(e: MouseEvent) {
    this.dragging?.onMouseUp(e);
    this.dragging = undefined;
  }
}

const { get: getDraggableContext, set: setDraggableContext } = createContext<DraggableContext>('draggable');

export const createDraggableContext = (opts: OptionsInput<DraggableContextOptions>) => {
  const context = new DraggableContext(opts);
  setDraggableContext(context);
  return context;
};

export { getDraggableContext };

export type DraggableModelOptions = {
  context: DraggableContext;
  element: HTMLDivElement | undefined;
  model: unknown;
};

export class DraggableModel extends Model<DraggableModelOptions> {
  readonly context = $derived(this.options.context);
  readonly element = $derived(this.options.element);
  readonly model = $derived(this.options.model);

  onMouseDown(e: MouseEvent) {
    this.context.onMouseDown(this, e);
  }

  readonly dragging = $derived(this.context.draggingFor(this));
}
