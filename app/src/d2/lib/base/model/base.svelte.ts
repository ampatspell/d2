import { description, guidFor } from '../utils/object';

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
