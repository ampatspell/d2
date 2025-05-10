import * as fs from '@firebase/firestore';
import type { NodeData } from '$d2-shared/documents';
import { Subscribable } from '$d2/lib/base/model/model.svelte';
import { isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { serialized } from '$d2/lib/base/utils/object';
import { mapModel } from '$d2/lib/base/model/models.svelte';
import { getter } from '$d2/lib/base/utils/options';
import { nodesCollection } from './nodes.svelte';
import { queryFirst } from '../base/fire/query.svelte';
import { createNodeDocumentModel, nodeDocumentKey } from './node.svelte';

export class NodeDocumentModelLoader extends Subscribable<{ ref: fs.Query }> {
  private readonly _query = queryFirst<NodeData>({
    ref: getter(() => this.options.ref),
  });

  private readonly doc = $derived(this._query.content);

  private readonly loaded = $derived.by(() => {
    const doc = this.doc;
    if (doc?.isLoaded) {
      return doc;
    }
  });

  private readonly _node = mapModel({
    source: getter(() => this.loaded),
    target: (doc) => createNodeDocumentModel(doc),
    key: nodeDocumentKey,
  });

  readonly node = $derived(this._node.content);

  async load() {
    await this._query.load();
    await this._node.load();
    await this.node?.load();
  }

  readonly dependencies = [this._query, this._node];
  readonly serialized = $derived(serialized(this, []));
  readonly isLoaded = $derived(isLoaded([this._query, this.node]));

  static forQuery(ref: fs.Query) {
    return new this({ ref });
  }

  static forId(id: string) {
    return this.forQuery(fs.query(nodesCollection, fs.where(fs.documentId(), '==', id)));
  }

  static forIdentifier(identifier: string) {
    return this.forQuery(fs.query(nodesCollection, fs.where('identifier', '==', identifier)));
  }
}
