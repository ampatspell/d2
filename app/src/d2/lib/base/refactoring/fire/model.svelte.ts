import type { SnapshotMetadata } from '@firebase/firestore';
import { LoadPromises } from '../../fire/load-promise.svelte';
import type { OptionsInput } from '../../utils/options';
import { Subscribable } from '../subscribable.svelte';

export type FirebaseModelOptions = {
  isPassive?: boolean;
};

export abstract class FirebaseModel<O extends FirebaseModelOptions = FirebaseModelOptions> extends Subscribable<O> {
  private _isLoading = $state(false);
  private _isLoaded = $state(false);
  private _error = $state<unknown>();
  readonly isError = $derived(!!this._error);
  private _metadata = $state<SnapshotMetadata>();
  readonly promises = new LoadPromises<typeof this, unknown>();
  readonly isPassive: boolean;

  get isLoading() {
    return this._subscribe(() => this._isLoading);
  }

  get isLoaded() {
    return this._subscribe(() => this._isLoaded);
  }

  get error() {
    return this._subscribe(() => this._error);
  }

  get metadata() {
    return this._subscribe(() => this._metadata);
  }

  constructor(options: OptionsInput<O>) {
    super(options);
    this.isPassive = this.options.isPassive ?? false;
  }

  protected _onWillLoad(subscribe: boolean) {
    this.promises._onWillLoad();
    this._error = undefined;
    this._metadata = undefined;
    this._isLoading = true;
    if (!subscribe) {
      this._isLoaded = false;
    }
  }

  declare path: string | undefined;

  protected _onError(error: unknown) {
    this._isLoading = false;
    this._error = error;
    this._metadata = undefined;
    console.error(this + '', error);
    this.promises._onError(error);
  }

  protected _onDidLoad(metadata: SnapshotMetadata) {
    this._isLoading = false;
    this._isLoaded = true;
    this._error = undefined;
    this._metadata = metadata;
    this.promises._onDidLoad(this, metadata.fromCache ? 'cached' : 'remote');
  }

  protected async _onLoad(cb: () => Promise<void>) {
    this._isLoading = true;
    try {
      await cb();
    } catch (err) {
      this._onError(err);
    } finally {
      this._isLoading = false;
    }
  }

  protected abstract _subscribeActive(): void;

  subscribe() {
    if (this.isPassive) {
      return;
    }
    this._subscribeActive();
  }
}
