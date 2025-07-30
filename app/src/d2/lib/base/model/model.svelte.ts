import { type OptionsInput } from '../utils/options';
import { Model } from './base.svelte';
import { type HasSubscriber, Subscriber } from './subscriber.svelte';

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
