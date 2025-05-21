import { options, type OptionsInput } from '../utils/options';
import { BaseModel } from './base.svelte';
import { type HasSubscriber, Subscriber } from './subscriber.svelte';

export class Model<O> extends BaseModel {
  protected readonly options: O;

  constructor(opts: OptionsInput<O>) {
    super();
    this.options = options(opts);
  }
}

export abstract class Subscribable<O> extends Model<O> implements HasSubscriber {
  readonly subscriber: Subscriber;

  constructor(opts: OptionsInput<O>) {
    super(opts);
    this.subscriber = new Subscriber(this);
  }

  readonly isSubscribed = $derived.by(() => this.subscriber.isSubscribed);

  subscribe() {}

  /**
   * Dependencies must be stable
   */
  abstract dependencies: HasSubscriber[];
}
