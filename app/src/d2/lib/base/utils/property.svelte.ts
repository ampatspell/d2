import type { DocumentData } from '@firebase/firestore';
import { getter, type OptionsInput } from './options';
import { Model, Subscribable } from '../model/model.svelte';
import type { Document } from '../fire/document.svelte';

export type PropertyUpdateResult<T = unknown> = {
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

export class Property<T = unknown, O extends PropertyOptions<T> = PropertyOptions<T>> extends Model<O> {
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

  delegate = $derived(this.options.delegate);
}

export type BasePropertiesModelOptions = {
  model: {
    didUpdate: <T>(properties: unknown, property: Property<T>, result: PropertyUpdateResult<T>) => Promise<void>;
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
> extends Subscribable<O> {
  readonly data = $derived(this.options.model.doc.data!);
  didUpdate<T>(property: Property<T>, result: PropertyUpdateResult<T>) {
    return this.options.model.didUpdate(this, property, result);
  }
}

export type DataModelPropertiesOptions<D extends DocumentData> = {
  model: {
    data: D;
  };
} & BasePropertiesModelOptions;

export class DataModelProperties<
  D extends DocumentData,
  O extends DataModelPropertiesOptions<D> = DataModelPropertiesOptions<D>,
> extends Subscribable<O> {
  readonly data = $derived(this.options.model.data);
  didUpdate<T>(property: Property<T>, result: PropertyUpdateResult<T>) {
    return this.options.model.didUpdate(this, property, result);
  }
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

export const integerToString = (source: Property<number | undefined>, fallback: number) => toRequired(source, fallback);

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
