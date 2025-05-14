import * as fs from '@firebase/firestore';
import { Subscribable } from '../base/model/model.svelte';
import { firebase } from '../base/fire/firebase.svelte';
import { isLoaded } from '../base/fire/is-loaded.svelte';
import { serialized } from '../base/utils/object';
import { queryAll } from '../base/fire/query.svelte';
import { getter, options } from '../base/utils/options';
import { mapModels } from '../base/model/models.svelte';
import { createNodeModel, nodeDocumentKey, NodeModel, type NodeBackendModelDelegate, type NodeData } from './node.svelte';
import type { NodeDefinitionModel } from '../definition/node.svelte';
import { Document } from '../base/fire/document.svelte';
import type { NodeParentData } from '$d2-shared/documents';

export const nodesCollection = fs.collection(firebase.firestore, 'nodes');

const asParent = (node: NodeModel | undefined): NodeParentData | null => {
  if (node) {
    const {
      id,
      path: { value: path },
      identifier,
    } = node;
    return {
      id,
      path,
      identifier,
    };
  }
  return null;
};

export type NodesModelOptions = {
  query: fs.Query;
};

export class NodesModel extends Subscribable<NodesModelOptions> {
  readonly _query = queryAll<NodeData>({
    ref: getter(() => this.options.query),
  });

  readonly delegate: NodeBackendModelDelegate = options({
    parentFor: (node) => this.byId(node.parent?.id),
  });

  readonly _nodes = mapModels({
    source: getter(() => this._query.content),
    target: (doc) => createNodeModel(doc, this.delegate),
    key: nodeDocumentKey,
  });

  readonly all = $derived(this._nodes.content);

  byParentId(id: string | null) {
    if (id === null) {
      return this.all.filter((node) => !node.parent);
    }
    return this.all.filter((node) => node.parent?.id === id);
  }

  byId(id: string | undefined) {
    return this.all.find((node) => node.id === id);
  }

  byPath(path: string | undefined) {
    if (path) {
      return this.all.find((node) => node.path.value === path);
    }
  }

  async create({ parent, definition }: { parent: NodeModel | undefined; definition: NodeDefinitionModel }) {
    const properties = definition.defaults();
    if (properties) {
      const ref = fs.doc(nodesCollection);
      const now = new Date();
      const identifier = ref.id;
      let path = `/${identifier}`;
      if (parent) {
        path = `${parent.path.value}/${identifier}`;
      }
      const data: NodeData = {
        kind: definition.type,
        path,
        identifier,
        parent: asParent(parent),
        properties,
        createdAt: now,
        updatedAt: now,
      };
      const doc = new Document<NodeData>({
        ref,
        data,
      });
      await doc.save();
      return this.all.find((node) => node.id === ref.id);
    }
  }

  async load() {
    await this._query.load();
    await this._nodes.load((node) => node.load());
  }

  readonly isLoaded = $derived(isLoaded([this._query]));
  readonly dependencies = [this._query, this._nodes];
  readonly serialized = $derived(serialized(this, []));

  static all() {
    return new this({
      query: nodesCollection,
    });
  }
}
