import type { SnapshotMetadata } from '@firebase/firestore';
import { LoadPromises } from './load-promise.svelte';
import { Subscribable } from '../model/model.svelte';
import type { OptionsInput } from '../utils/options';
import type { VoidCallback } from '../utils/types';

export type FirebaseModelOptions = {
  isPassive?: boolean;
};

export abstract class FirebaseModel<O extends FirebaseModelOptions = FirebaseModelOptions> extends Subscribable<O> {
  isLoading = $state(false);
  isLoaded = $state(false);
  error = $state<unknown>();
  isError = $derived.by(() => !!this.error);
  metadata = $state<SnapshotMetadata>();
  promises = new LoadPromises<typeof this, unknown>();
  isPassive: boolean;

  constructor(options: OptionsInput<O>) {
    super(options);
    this.isPassive = this.options.isPassive ?? false;
  }

  _onWillLoad(subscribe: boolean) {
    this.promises._onWillLoad();
    this.error = undefined;
    this.metadata = undefined;
    this.isLoading = true;
    if (!subscribe) {
      this.isLoaded = false;
    }
  }

  _onError(error: unknown) {
    this.isLoading = false;
    this.error = error;
    this.metadata = undefined;
    this.promises._onError(error);
  }

  _onDidLoad(metadata: SnapshotMetadata) {
    this.isLoading = false;
    this.isLoaded = true;
    this.error = undefined;
    this.metadata = metadata;
    this.promises._onDidLoad(this, metadata.fromCache ? 'cached' : 'remote');
  }

  abstract _subscribeActive(): VoidCallback;

  subscribe() {
    if (this.isPassive) {
      return;
    }
    return this._subscribeActive();
  }

  dependencies = [];
}
