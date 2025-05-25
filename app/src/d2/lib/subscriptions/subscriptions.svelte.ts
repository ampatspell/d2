import * as fs from '@firebase/firestore';
import { firebase } from '../base/fire/firebase.svelte';
import { Subscribable } from '../base/model/model.svelte';
import { queryAll } from '../base/fire/query.svelte';
import type { SubscriptionData } from '$d2-shared/documents';
import { mapModels } from '../base/model/models.svelte';
import type { Document } from '../base/fire/document.svelte';
import { getter } from '../base/utils/options';
import { isLoaded } from '../base/fire/is-loaded.svelte';

export const subscriptionsCollection = fs.collection(firebase.firestore, 'subscriptions');

export type SubscriptionsModelOptions = undefined;

export class SubscriptionsModel extends Subscribable<SubscriptionsModelOptions> {
  private _query = queryAll<SubscriptionData>({
    ref: subscriptionsCollection,
  });

  private _docs = $derived(this._query.content);

  private _subscriptions = mapModels({
    source: getter(() => this._docs),
    target: (doc) => new SubscriptionModel({ doc }),
  });

  readonly all = $derived(this._subscriptions.content);

  byId(id: string | undefined) {
    return this.all.find((model) => model.id === id);
  }

  async load() {
    await this._query.load();
    await this._subscriptions.load((model) => model.load());
  }

  readonly isLoaded = $derived(isLoaded([this._query]));
  readonly dependencies = [this._query, this._subscriptions];
}

export type SubscriptionModelOptions = {
  doc: Document<SubscriptionData>;
};

export class SubscriptionModel extends Subscribable<SubscriptionModelOptions> {
  readonly doc = $derived(this.options.doc);
  readonly id = $derived(this.doc.id!);
  readonly data = $derived(this.doc.data!);

  readonly kinds = $derived(this.data.kinds);
  readonly fullName = $derived(this.data.fullName);
  readonly email = $derived(this.data.email);
  readonly isEmailVerified = $derived(this.data.isEmailVerified);

  readonly createdAt = $derived(this.data.createdAt);
  readonly updatedAt = $derived(this.data.updatedAt);

  async load() {
    await this.doc.load();
  }

  async delete() {
    await this.doc.delete();
  }

  readonly isLoaded = $derived(isLoaded([this.doc]));
  readonly dependencies = [this.doc];
}
