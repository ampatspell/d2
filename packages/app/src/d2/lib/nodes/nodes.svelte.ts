import * as fs from '@firebase/firestore';
import type { NodeData } from '$d2-shared/documents';
import { Subscribable } from '../base/model/model.svelte';
import { firebase } from '../base/fire/firebase.svelte';
import { isLoaded } from '../base/fire/is-loaded.svelte';
import { serialized } from '../base/utils/object';
import { queryAll } from '../base/fire/query.svelte';
import { getter } from '../base/utils/options';
import { mapModels } from '../base/model/models.svelte';
import { createNodeDocumentModel, nodeDocumentKey } from './node.svelte';

export const nodesCollection = fs.collection(firebase.firestore, 'nodes');

export type NodesModelOptions = {
  query: fs.Query;
};

export class NodesModel extends Subscribable<NodesModelOptions> {
  readonly _query = queryAll<NodeData>({
    ref: getter(() => this.options.query),
  });

  readonly _nodes = mapModels({
    source: getter(() => this._query.content),
    target: (doc) => createNodeDocumentModel(doc),
    key: nodeDocumentKey,
  });

  readonly all = $derived(this._nodes.content);

  byParentId(id: string | null) {
    return this.all.filter((node) => node.parentId === id);
  }

  async load() {
    await this._query.load();
    await this._nodes.load();
  }

  // async create<Type extends NodeType>(parent: string | undefined, kind: Type, properties: NodeTypes[Type]) {
  //   const model = NodeDocumentModel.buildNew({
  //     data: {
  //       kind,
  //       properties,
  //       parent: parent ?? null,
  //       createdAt: new Date(),
  //     },
  //   });
  //   await model.save();
  //   return model;
  // }

  readonly isLoaded = $derived(isLoaded([this._query]));
  readonly dependencies = [this._query, this._nodes];
  readonly serialized = $derived(serialized(this, []));

  static all() {
    return new this({
      query: nodesCollection,
    });
  }
}
