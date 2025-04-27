import { description } from '../utils/object';

export type HasDescriptionAndSerialized = {
  description?: string;
  serialized?: unknown;
};

export class BaseModel implements HasDescriptionAndSerialized {
  declare readonly serialized?: Record<string, unknown>;
  readonly description = $derived.by(() => description(this, this.serialized));

  toString() {
    return this.description;
  }
}
