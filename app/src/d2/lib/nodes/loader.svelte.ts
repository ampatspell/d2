import * as fs from '@firebase/firestore';
import { Subscribable } from '$d2/lib/base/model/model.svelte';
import { isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { serialized } from '$d2/lib/base/utils/object';
import { mapModel } from '$d2/lib/base/model/models.svelte';
import { getter } from '$d2/lib/base/utils/options';
import { nodesCollection } from './nodes.svelte';
import { queryFirst } from '../base/fire/query.svelte';
import { createNodeDocumentModel, nodeDocumentKey, NodeDocumentModel, type NodeData } from './node.svelte';

type NodeDocumentModelFactory<Model extends NodeDocumentModel> = { new (...args: ConstructorParameters<typeof NodeDocumentModel<never>>): Model };

export type NodeDocumentModelLoaderOptions<Model extends NodeDocumentModel> = {
  ref: fs.Query;
  factory?: NodeDocumentModelFactory<Model>;
}

export class NodeDocumentModelLoader<Model extends NodeDocumentModel = NodeDocumentModel> extends Subscribable<NodeDocumentModelLoaderOptions<Model>> {
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

  private readonly __node = mapModel({
    source: getter(() => this.loaded),
    target: (doc) => {
      return createNodeDocumentModel(doc);
    },
    key: nodeDocumentKey,
  });

  readonly _node = $derived(this.__node.content);
  readonly node = $derived.by(() => {
    const factory = this.options.factory;
    if(factory) {
      return this.as(factory);
    }
  });

  as<Model extends NodeDocumentModel>(factory: NodeDocumentModelFactory<Model>) {
    const node = this._node;
    if(node instanceof factory) {
      return node;
    }
  }

  async load() {
    await this._query.load();
    await this.__node.load();
    await this._node?.load();
  }

  readonly dependencies = [this._query, this.__node];
  readonly serialized = $derived(serialized(this, []));
  readonly isLoaded = $derived(isLoaded([this._query, this._node]));

  static forQuery<Model extends NodeDocumentModel = NodeDocumentModel>(ref: fs.Query, factory?: NodeDocumentModelFactory<Model>) {
    return new this({ ref, factory });
  }

  static forId<Model extends NodeDocumentModel = NodeDocumentModel>(id: string, factory?: NodeDocumentModelFactory<Model>) {
    return this.forQuery(fs.query(nodesCollection, fs.where(fs.documentId(), '==', id)), factory);
  }

  static forIdentifier<Model extends NodeDocumentModel = NodeDocumentModel>(identifier: string, factory?: NodeDocumentModelFactory<Model>) {
    return this.forQuery(fs.query(nodesCollection, fs.where('identifier', '==', identifier)), factory);
  }

  static forPath<Model extends NodeDocumentModel = NodeDocumentModel>(path: string, factory?: NodeDocumentModelFactory<Model>) {
    return this.forQuery(fs.query(nodesCollection, fs.where('path', '==', path)), factory);
  }
}
