import * as fs from '@firebase/firestore';
import { Subscribable } from '$d2/lib/base/model/model.svelte';
import { asIsLoadedModel, isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { serialized } from '$d2/lib/base/utils/object';
import { mapModel, mapModels } from '$d2/lib/base/model/models.svelte';
import { getter } from '$d2/lib/base/utils/options';
import { nodesCollection } from './nodes.svelte';
import { queryAll, queryFirst } from '../base/fire/query.svelte';
import { createNodeModel, nodeDocumentKey, NodeModel, type NodeData, type NodeModelFactory } from './node.svelte';
import { preloadModel } from '../base/fire/preload.svelte';

export type NodeModelLoaderOptions<Model extends NodeModel> = {
  ref: fs.Query;
  key: string;
  factory?: NodeModelFactory<Model>;
};

export class NodeModelLoader<Model extends NodeModel = NodeModel> extends Subscribable<NodeModelLoaderOptions<Model>> {
  private readonly _query = queryFirst<NodeData>({
    ref: getter(() => this.options.ref),
  });

  private readonly _doc = $derived(this._query.content);

  private readonly _loaded = $derived.by(() => {
    const doc = this._doc;
    if (doc?.isLoaded) {
      return doc;
    }
  });

  private readonly __node = mapModel({
    source: getter(() => this._loaded),
    target: (doc) => createNodeModel(doc),
    key: nodeDocumentKey,
  });

  private readonly _node = $derived(this.__node.content);

  readonly node = $derived.by(() => {
    const factory = this.options.factory;
    if (factory) {
      return this.as(factory);
    }
    return this._node as Model;
  });

  as<Model extends NodeModel>(factory: NodeModelFactory<Model>) {
    const node = this._node;
    if (node?.is(factory)) {
      return node;
    }
  }

  async load() {
    await this._query.load();
    await this.__node.load();
    await this._node?.load();
  }

  preload() {
    return preloadModel(this);
  }

  readonly key = $derived(this.options.key);

  readonly dependencies = [this._query, this.__node];
  readonly isLoaded = $derived(isLoaded([this._query, this._node]));
  readonly serialized = $derived(serialized(this, ['key', 'node']));
}

export const nodeForQuery = <Model extends NodeModel = NodeModel>(
  ref: fs.Query,
  key: string,
  factory?: NodeModelFactory<Model>,
) => {
  return new NodeModelLoader({ ref, key, factory });
};

export const nodeForId = <Model extends NodeModel = NodeModel>(id: string, factory?: NodeModelFactory<Model>) => {
  return nodeForQuery(fs.query(nodesCollection, fs.where(fs.documentId(), '==', id)), `id:${id}`, factory);
};

export const nodeForIdentifier = <Model extends NodeModel = NodeModel>(
  identifier: string,
  factory?: NodeModelFactory<Model>,
) => {
  return nodeForQuery(
    fs.query(nodesCollection, fs.where('identifier', '==', identifier)),
    `identifier:${identifier}`,
    factory,
  );
};

export const nodeForPath = <Model extends NodeModel = NodeModel>(path: string, factory?: NodeModelFactory<Model>) => {
  return nodeForQuery(fs.query(nodesCollection, fs.where('path', '==', path)), `path:${path}`, factory);
};

export const node = {
  forQuery: nodeForQuery,
  forId: nodeForId,
  forIdentifier: nodeForIdentifier,
  forPath: nodeForPath,
};

export type NodesModelLoaderOptions<Model extends NodeModel> = {
  ref: fs.Query;
  key: string;
  factory?: NodeModelFactory<Model>;
};

export class NodesModelLoader<Model extends NodeModel = NodeModel> extends Subscribable<
  NodesModelLoaderOptions<Model>
> {
  private readonly _query = queryAll<NodeData>({
    ref: getter(() => this.options.ref),
  });

  private readonly _docs = $derived(this._query.content);

  private readonly _loaded = $derived.by(() => this._docs.filter((doc) => doc.isLoaded));

  private readonly __nodes = mapModels({
    source: getter(() => this._loaded),
    target: (doc) => {
      return createNodeModel(doc);
    },
    key: nodeDocumentKey,
  });

  private readonly _nodes = $derived(this.__nodes.content);

  readonly nodes = $derived.by(() => {
    const factory = this.options.factory;
    if (factory) {
      return this._nodes.filter((node) => node.is(factory));
    }
    return this._nodes as Model[];
  });

  async load() {
    await this._query.load();
    await this.__nodes.load();
    await Promise.all(this._nodes?.map((node) => node.load()));
  }

  async preload() {
    return preloadModel(this);
  }

  readonly key = $derived(this.options.key);

  readonly dependencies = [this._query, this.__nodes];
  readonly serialized = $derived(serialized(this, ['key', 'nodes']));
  readonly isLoaded = $derived(isLoaded([this._query, asIsLoadedModel(this._nodes)]));
}

export const nodesForQuery = <Model extends NodeModel = NodeModel>(
  ref: fs.Query,
  key: string,
  factory?: NodeModelFactory<Model>,
) => {
  return new NodesModelLoader({ ref, key, factory });
};

export const nodesForParentId = <Model extends NodeModel = NodeModel>(
  parentId: string,
  factory?: NodeModelFactory<Model>,
) => {
  return nodesForQuery(fs.query(nodesCollection, fs.where('parent.id', '==', parentId)), `parent:${parentId}`, factory);
};

export const nodesForParentPath = <Model extends NodeModel = NodeModel>(
  path: string,
  factory?: NodeModelFactory<Model>,
) => {
  return nodesForQuery(fs.query(nodesCollection, fs.where('parent.path', '==', path)), `path:${path}`, factory);
};

export const nodesForParentIdentifier = <Model extends NodeModel = NodeModel>(
  identifier: string,
  factory?: NodeModelFactory<Model>,
) => {
  return nodesForQuery(
    fs.query(nodesCollection, fs.where('parent.identifier', '==', identifier)),
    `identifier:${identifier}`,
    factory,
  );
};

export const nodes = {
  forQuery: nodesForQuery,
  forParentId: nodesForParentId,
  forParentPath: nodesForParentPath,
  forParentIdentifier: nodesForParentIdentifier,
};
