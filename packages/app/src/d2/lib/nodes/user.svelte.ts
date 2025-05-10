import * as fs from '@firebase/firestore';
import { Subscribable } from '../base/model/model.svelte';
import { getter } from '../base/utils/options';
import { getSession } from '../session/session.svelte';
import { firebase } from '../base/fire/firebase.svelte';
import { queryAll } from '../base/fire/query.svelte';
import { mapModels } from '../base/model/models.svelte';
import type { UserNodeData } from '$d2-shared/documents';
import { Document } from '../base/fire/document.svelte';
import { isLoaded } from '../base/fire/is-loaded.svelte';
import type { FoldSate } from '$d2/components/dark/section/page/fold.svelte';

export const userNodesCollection = (uid: string) => fs.collection(firebase.firestore, `users/${uid}/nodes`);

export type NodesSettingsModelOptions = {
  uid: string | undefined;
};

export class NodesSettingsModel extends Subscribable<NodesSettingsModelOptions> {
  readonly uid = $derived(this.options.uid);

  private readonly ref = $derived.by(() => {
    const uid = this.uid;
    if (uid) {
      return userNodesCollection(uid);
    }
  });

  private readonly _query = queryAll<UserNodeData>({
    ref: getter(() => this.ref),
  });

  private _model(doc: Document<UserNodeData>) {
    return new NodeSettingsModel({ doc });
  }

  private _buildModel(id: string) {
    const ref = this.ref;
    if (ref) {
      const doc = new Document<UserNodeData>({
        ref: fs.doc(this.ref, id),
        data: {
          open: true,
        },
      });
      return this._model(doc);
    }
  }

  private readonly _models = mapModels({
    source: getter(() => this._query.content),
    target: (doc) => this._model(doc),
  });

  readonly models = $derived(this._models.content);

  get isAnyOpen() {
    return !!this.models.find((model) => model.isOpen);
  }

  get isAllClosed() {
    return !this.models.find((model) => model.isOpen);
  }

  get fold(): FoldSate | undefined {
    if (this.isAnyOpen) {
      return 'fold';
    }
    if (this.isAllClosed) {
      return 'unfold';
    }
    return undefined;
  }

  forNode(id: string) {
    return this.models.find((model) => model.id === id);
  }

  setOpen(id: string, isOpen: boolean) {
    const model = this.forNode(id) ?? this._buildModel(id);
    if (model) {
      model.setOpen(isOpen);
    }
  }

  async scheduleSetOpen(id: string, isOpen: boolean) {
    await Promise.resolve();
    this.setOpen(id, isOpen);
  }

  async setOpenAll(open: boolean) {
    await Promise.all(
      this.models.map(async (model) => {
        await model.setOpen(open);
      }),
    );
  }

  isOpen(id: string) {
    const model = this.forNode(id);
    if (!model) {
      this.scheduleSetOpen(id, true);
    }
    return model?.isOpen ?? true;
  }

  readonly dependencies = [this._query, this._models];
  readonly isLoaded = $derived(isLoaded([this._query]));

  async load() {
    await this._query.load();
    await this._models.load();
  }

  static forCurrentUser() {
    const session = getSession();
    return new this({
      uid: getter(() => session.user?.uid),
    });
  }
}

export type NodeSettingsModelOptions = {
  doc: Document<UserNodeData>;
};

export class NodeSettingsModel extends Subscribable<NodeSettingsModelOptions> {
  readonly doc = $derived(this.options.doc);
  readonly isNew = $derived(this.doc.isNew);
  readonly id = $derived(this.doc.id);
  readonly data = $derived(this.doc.data!);

  readonly isOpen = $derived(this.data.open);

  async save() {
    await this.doc.save();
  }

  async setOpen(open: boolean) {
    if (open !== this.isOpen || this.isNew) {
      this.data.open = open;
      await this.save();
    }
  }
}
