import * as fs from '@firebase/firestore';
import { firebase } from '../base/fire/firebase.svelte';
import type { UserData, UserRole } from '$d2-shared/documents';
import { isLoaded } from '../base/fire/is-loaded.svelte';
import { getSession, setRole } from '../session/session.svelte';
import { SubscribableModel as SubscribableModel } from '../base/refactoring/subscribable.svelte';
import { Document } from '../base/refactoring/fire/document.svelte';
import { queryAll } from '../base/refactoring/fire/query.svelte';
import { getter } from '../base/utils/options';
import { mapModels } from '../base/refactoring/fire/models.svelte';

export const usersCollection = fs.collection(firebase.firestore, 'users');

export type UsersModelOptions = undefined;

export class UsersModel extends SubscribableModel<UsersModelOptions> {
  private _query = queryAll<UserData>({
    ref: fs.query(usersCollection, fs.where('isAnonymous', '==', false)),
  });

  private _docs = $derived(this._query.content);

  private _users = mapModels({
    source: getter(() => this._docs),
    target: (doc) => new UsersUserModel({ doc }),
  });

  readonly all = $derived(this._users.content);

  readonly isLoaded = $derived(isLoaded([this._query]));
  readonly dependencies = [this._query, this._users];
}

export type UsersUserModelOptions = {
  doc: Document<UserData>;
};

export class UsersUserModel extends SubscribableModel<UsersUserModelOptions> {
  readonly doc = $derived(this.options.doc);
  readonly id = $derived(this.doc.id!);
  readonly data = $derived(this.doc.data!);

  readonly email = $derived(this.data.email);
  readonly role = $derived(this.data.role);

  private readonly session = $derived(getSession());
  readonly isMe = $derived(this.id === this.session.user?.uid);

  async setRole(role: UserRole) {
    await setRole(this.id, role);
  }

  readonly isLoaded = $derived(isLoaded([this.doc]));
  readonly dependencies = [this.doc];

  static forId(id: string) {
    return new this({
      doc: new Document<UserData>({
        ref: fs.doc(usersCollection, id),
      }),
    });
  }
}
