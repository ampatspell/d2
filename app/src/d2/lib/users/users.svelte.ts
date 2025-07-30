import * as fs from '@firebase/firestore';
import { queryAll } from '../base/fire/query.svelte';
import { firebase } from '../base/fire/firebase.svelte';
import type { UserData, UserRole } from '$d2-shared/documents';
import { isLoaded } from '../base/fire/is-loaded.svelte';
import { getSession, setRole } from '../session/session.svelte';
import { Subscribable } from '../base/refactoring/subscribable.svelte';
import { Document } from '../base/refactoring/fire/document.svelte';

export const usersCollection = fs.collection(firebase.firestore, 'users');

export type UsersModelOptions = undefined;

export class UsersModel extends Subscribable<UsersModelOptions> {
  private _query = queryAll<UserData>({
    ref: fs.query(usersCollection, fs.where('isAnonymous', '==', false)),
  });

  private _docs = $derived(this._query.content);

  // private _users = mapModels({
  //   source: getter(() => this._docs),
  //   target: (doc) => new UsersUserModel({ doc }),
  // });

  // readonly all = $derived(this._users.content);
  readonly all: any[] = [];

  async load() {
    await this._query.load();
    // await this._users.load((model) => model.load());
  }

  // readonly isLoaded = $derived(isLoaded([this._query]));
  readonly isLoaded = true;
}

export type UsersUserModelOptions = {
  doc: Document<UserData>;
};

export class UsersUserModel extends Subscribable<UsersUserModelOptions> {
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

  async load() {
    await this.doc.load();
  }

  readonly isLoaded = $derived(isLoaded([this.doc]));

  static forId(id: string) {
    return new this({
      doc: new Document<UserData>({
        ref: fs.doc(usersCollection, id),
      }),
    });
  }
}
