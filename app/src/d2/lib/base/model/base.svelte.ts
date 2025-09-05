import { description, guidFor } from '../utils/object';
import { options, type OptionsInput } from '../utils/options';

export type HasDescriptionAndSerialized = {
  description?: string;
  serialized?: unknown;
};

export class BaseModel implements HasDescriptionAndSerialized {
  declare readonly serialized?: Record<string, unknown>;
  readonly description = $derived(description(this, this.serialized));

  constructor() {
    guidFor(this);
  }

  toString() {
    return this.description;
  }
}

export class Model<O> extends BaseModel {
  protected readonly options: O;

  constructor(opts: OptionsInput<O>) {
    super();
    this.options = options(opts);
  }
}
