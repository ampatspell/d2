import { Model } from '$d2/lib/base/model/model.svelte';
import type { Point } from '$d2/lib/base/utils/types';

const threshold = 10;

export type DraggableStateOptions = {
  element: HTMLDivElement | undefined;
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

export class DraggableState extends Model<DraggableStateOptions> {
  private phase = $state<'preflight' | 'dragging'>('preflight');

  readonly isDragging = $derived(this.phase === 'dragging');

  private down?: Point;
  private offset?: Point;
  private mouse = $state<Point>();

  readonly dragging = $derived.by(() => {
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
    const rect = this.options.element?.getBoundingClientRect();
    if (rect) {
      this.offset = {
        x: down.x - rect.left,
        y: down.y - rect.top,
      };
    }
  }

  onMouseMove(e: MouseEvent) {
    const point = eventToClientPoint(e);
    this.mouse = point;
    if (this.phase === 'preflight') {
      if (distance(this.down!, point) > threshold) {
        this.phase = 'dragging';
      }
    }
  }

  onMouseUp() {}
}
