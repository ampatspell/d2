import * as fs from '@firebase/firestore';
import type { NodeData, NodeType, NodeTypes } from '$d2-shared/documents';
import { Subscribable } from '../base/model/model.svelte';
import { firebase } from '../base/fire/firebase.svelte';
import { isLoaded } from '../base/fire/is-loaded.svelte';
import { serialized } from '../base/utils/object';
import { QueryAll } from '../base/fire/query.svelte';
import { getter } from '../base/utils/options';
import { MapModels } from '../base/model/models.svelte';
import { NodeDocumentModel } from './node.svelte';

export const nodesCollection = fs.collection(firebase.firestore, 'nodes');

export type NodesModelOptions = {
  parent: string | undefined;
};

export class NodesModel extends Subscribable<NodesModelOptions> {
  readonly _query = new QueryAll<NodeData<never>>({
    ref: getter(() => fs.query(nodesCollection, fs.where('parent', '==', this.options.parent ?? null))),
  });

  readonly _nodes = new MapModels({
    source: getter(() => this._query.content),
    target: (doc) => new NodeDocumentModel({ doc }),
  });

  async load() {
    await this._query.load();
    await this._nodes.load();
  }

  async create<Type extends NodeType>(kind: Type, properties: NodeTypes[Type]) {
    const model = NodeDocumentModel.buildNew({
      data: {
        kind,
        properties,
        parent: this.options.parent ?? null,
        createdAt: new Date(),
      },
    });
    await model.save();
    return model;
  }

  readonly isLoaded = $derived(isLoaded([this._query]));
  readonly dependencies = [this._query, this._nodes];
  readonly serialized = $derived(serialized(this, []));

  static byParent(parent: string | undefined) {
    return new this({ parent });
  }

  static root() {
    return new NodesModel({
      parent: undefined,
    });
  }
}
