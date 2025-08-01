import type { DocumentData } from '@firebase/firestore';
import { getter, type OptionsInput } from './options';
import { removeObject, sortedBy } from './array';
import type { DraggableOnDrop } from '$d2/components/dark/draggable/models.svelte';
import { Model } from '../model/base.svelte';
import { SubscribableModel } from '../refactoring/subscribable.svelte';
import type { HasPosition } from './types';
import type { Document } from '../refactoring/fire/document.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropertyUpdateResult<T = any> = {
  before: T;
  after: T;
};

export type PropertyDelegateOptions = {
  didUpdate?: <T>(property: Property<T>, result: PropertyUpdateResult<T>) => void;
};

export type PropertyOptions<T> = {
  delegate?: PropertyDelegateOptions;
  value: T;
  update: (value: T) => void;
} & PropertyDelegateOptions;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Property<T = any, O extends PropertyOptions<T> = PropertyOptions<T>> extends Model<O> {
  readonly value = $derived.by(() => this.options.value);

  constructor(opts: OptionsInput<O>) {
    super(opts);
  }

  private didUpdate(result: PropertyUpdateResult<T>) {
    this.options.didUpdate?.(this, result);
    this.options.delegate?.didUpdate?.(this, result);
  }

  update(after: T) {
    const before = this.value;
    if (before !== after) {
      this.options.update(after);
      this.didUpdate({ before, after });
    }
  }

  asResult(result: PropertyUpdateResult<T>): PropertyUpdateResult<T> {
    return result as PropertyUpdateResult<T>;
  }

  delegate = $derived(this.options.delegate);
}

export type BasePropertiesModelOptions = {
  model: {
    didUpdate: <T>(property: Property<T>, result: PropertyUpdateResult<T>) => Promise<void>;
  };
};

export type DocumentModelPropertiesOptions<D extends DocumentData> = {
  model: {
    doc: Document<D>;
  };
} & BasePropertiesModelOptions;

export class DocumentModelProperties<
  D extends DocumentData,
  O extends DocumentModelPropertiesOptions<D> = DocumentModelPropertiesOptions<D>,
> extends SubscribableModel<O> {
  readonly data = $derived(this.options.model.doc.data!);
  didUpdate<T>(property: Property<T>, result: PropertyUpdateResult<T>) {
    return this.options.model.didUpdate(property, result);
  }

  readonly dependencies = [];
}

export type DataModelPropertiesOptions<D extends DocumentData> = {
  model: {
    data: D;
  };
} & BasePropertiesModelOptions;

export class DataModelProperties<
  D extends DocumentData,
  O extends DataModelPropertiesOptions<D> = DataModelPropertiesOptions<D>,
> extends SubscribableModel<O> {
  readonly data = $derived(this.options.model.data);
  didUpdate<T>(property: Property<T>, result: PropertyUpdateResult<T>) {
    return this.options.model.didUpdate(property, result);
  }

  readonly dependencies = [];
}

export type PropertyDelegateWithData<D> = { data: D } & PropertyDelegateOptions;

export const data = <D, K extends keyof D>(
  model: PropertyDelegateWithData<D>,
  key: K,
  opts?: { update?: (value: D[K]) => D[K] },
) => {
  return new Property<D[K]>({
    delegate: model,
    value: getter(() => model.data[key]),
    update: (value: D[K]) => {
      const update = opts?.update;
      if (update) {
        value = update(value);
      }
      model.data[key] = value;
    },
  });
};

export type ArrayPropertyItemModelOptions<T extends HasPosition> = {
  array: ArrayPropertyModel<T>;
  data: T;
};

export class ArrayPropertyItemModel<T extends HasPosition = HasPosition> extends Model<
  ArrayPropertyItemModelOptions<T>
> {
  readonly data = $derived(this.options.data);
  readonly position = data(this, 'position');

  delete() {
    this.options.array.delete(this.data);
  }

  didUpdate() {
    this.options.array.didUpdate();
  }
}

export type ArrayPropertyModelOptions<T extends HasPosition, I extends ArrayPropertyItemModel<T>> = {
  property: Property<T[]>;
  factory: new (...args: ConstructorParameters<typeof ArrayPropertyItemModel<T>>) => I;
  add: (position: number) => T;
};

export class ArrayPropertyModel<
  T extends HasPosition = HasPosition,
  I extends ArrayPropertyItemModel<T> = ArrayPropertyItemModel<T>,
> extends Model<ArrayPropertyModelOptions<T, I>> {
  readonly property = $derived(this.options.property);

  private readonly _items = $derived.by(() => {
    const factory = this.options.factory;
    return this.property.value.map((data) => {
      return new factory({ array: this, data });
    });
  });

  readonly items = $derived(sortedBy(this._items, [{ value: (item) => item.position.value }]));

  add() {
    const array = this.property.value;
    array.push(this.options.add(array.length));
    this.property.update([...array]);
  }

  delete(data: T) {
    const array = this.property.value;
    removeObject(array, data);
    this.property.update([...array]);
  }

  didUpdate() {
    this.property.update([...this.property.value]);
  }

  reorder(force = false) {
    const items = [...this.items];
    if (items.filter((item, idx) => item.position.update(idx)).length || force) {
      this.didUpdate();
    }
  }

  onReorder({ position, source, target }: DraggableOnDrop<I>) {
    let diff;
    if (position === 'before') {
      diff = -0.5;
    } else {
      diff = 0.5;
    }
    source.position.update(target.position.value + diff);
    this.reorder(true);
  }
}

export const array = <
  T extends HasPosition = HasPosition,
  I extends ArrayPropertyItemModel<T> = ArrayPropertyItemModel<T>,
>(
  opts: ArrayPropertyModelOptions<T, I>,
) => {
  return new ArrayPropertyModel<T, I>(opts);
};

export type TransformOptions<IS, IT, RS, RT> = {
  toTarget: (source: IS) => RT;
  toSource: (target: IT) => RS;
};

export const transform = <S, T>(source: Property<S>, { toTarget, toSource }: TransformOptions<S, T, S, T>) => {
  return new Property<T>({
    value: getter(() => toTarget(source.value)),
    update: (target) => source.update(toSource(target)),
  });
};

export const optionalTransform = <S, T>(
  source: Property<S | undefined>,
  { toTarget, toSource }: TransformOptions<S, T, S, T | undefined>,
) => {
  return transform<S | undefined, T | undefined>(source, {
    toSource: (value) => {
      if (value) {
        return toSource(value);
      }
    },
    toTarget: (value) => {
      if (value) {
        return toTarget(value);
      }
    },
  });
};

const _integerToString = (number: number | undefined) => {
  if (typeof number === 'number') {
    if (!isNaN(number) && number !== Infinity) {
      return String(number);
    }
  }
  return '';
};

const _stringToInteger = (string: string) => {
  const number = parseInt(string);
  if (!isNaN(number) && number !== Infinity) {
    return number;
  }
  return undefined;
};

export const optionalIntegerToString = (source: Property<number | undefined>): Property<string> =>
  transform(source, {
    toSource: (value) => _stringToInteger(value),
    toTarget: (value) => _integerToString(value),
  });

export const toOptional = <T>(source: Property<T>, fallback: T) =>
  transform<T, T | undefined>(source, {
    toSource: (value) => value ?? fallback,
    toTarget: (value) => value,
  });

export const toRequired = <T>(source: Property<T | undefined>, fallback: T) =>
  transform<T | undefined, T>(source, {
    toSource: (value) => value,
    toTarget: (value) => value ?? fallback,
  });
