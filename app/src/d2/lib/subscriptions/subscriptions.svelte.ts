import * as fs from '@firebase/firestore';
import { firebase } from '../base/fire/firebase.svelte';
import type { SubscriptionData } from '$d2-shared/documents';
import { getter } from '../base/utils/options';
import { isLoaded } from '../base/fire/is-loaded.svelte';
import { SubscribableModel } from '../base/refactoring/subscribable.svelte';
import { queryAll } from '../base/refactoring/fire/query.svelte';
import { mapModels } from '../base/refactoring/fire/models.svelte';
import type { Document } from '../base/refactoring/fire/document.svelte';

export const subscriptionsCollection = fs.collection(firebase.firestore, 'subscriptions');

export type SubscriptionsModelOptions = undefined;

export class SubscriptionsModel extends SubscribableModel<SubscriptionsModelOptions> {
  private _query = queryAll<SubscriptionData>({
    ref: subscriptionsCollection,
  });

  private _subscriptions = mapModels({
    source: getter(() => this._query.content),
    target: (doc) => new SubscriptionModel({ doc }),
  });

  readonly all = $derived(this._subscriptions.content);

  byId(id: string | undefined) {
    return this.all.find((model) => model.id === id);
  }

  readonly isLoaded = $derived(isLoaded([this._query]));
  readonly dependencies = [this._query, this._subscriptions];
}

export type SubscriptionModelOptions = {
  doc: Document<SubscriptionData>;
};

export class SubscriptionModel extends SubscribableModel<SubscriptionModelOptions> {
  readonly doc = $derived(this.options.doc);
  readonly id = $derived(this.doc.id!);
  readonly data = $derived(this.doc.data!);

  readonly kinds = $derived(this.data.kinds);
  readonly fullName = $derived(this.data.fullName);
  readonly email = $derived(this.data.email);
  readonly isEmailVerified = $derived(this.data.isEmailVerified);

  readonly createdAt = $derived(this.data.createdAt);
  readonly updatedAt = $derived(this.data.updatedAt);

  async delete() {
    await this.doc.delete();
  }

  readonly isLoaded = $derived(isLoaded([this.doc]));
  readonly dependencies = [this.doc];
}
