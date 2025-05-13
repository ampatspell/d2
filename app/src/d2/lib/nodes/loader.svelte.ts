import * as fs from '@firebase/firestore';
import { Subscribable } from '$d2/lib/base/model/model.svelte';
import { asIsLoadedModel, isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { serialized } from '$d2/lib/base/utils/object';
import { mapModel, mapModels } from '$d2/lib/base/model/models.svelte';
import { getter, options, type OptionsInput } from '$d2/lib/base/utils/options';
import { nodesCollection } from './nodes.svelte';
import { queryAll, queryFirst } from '../base/fire/query.svelte';
import { createNodeModel, nodeDocumentKey, NodeModel, type NodeData, type NodeModelFactory } from './node.svelte';
import { preloadModel } from '../base/fire/preload.svelte';

export type NodeLoaderModelOptions<Model extends NodeModel> = {
  ref: fs.Query;
  key?: string;
  factory?: NodeModelFactory<Model>;
};

export class NodeLoaderModel<Model extends NodeModel = NodeModel> extends Subscribable<NodeLoaderModelOptions<Model>> {
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
    await this.__node.load((model) => model.load());
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
  opts: OptionsInput<NodeLoaderModelOptions<Model>>,
) => {
  return new NodeLoaderModel(opts);
};

export const nodeForId = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{ id: string; factory?: NodeModelFactory<Model> }>,
) => {
  const opts = options(_opts);
  return nodeForQuery({
    ref: fs.query(nodesCollection, fs.where(fs.documentId(), '==', opts.id)),
    key: `id:${opts.id}`,
    factory: getter(() => opts.factory),
  });
};

export const nodeForIdentifier = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{
    identifier: string;
    factory?: NodeModelFactory<Model>;
  }>,
) => {
  const opts = options(_opts);
  return nodeForQuery({
    ref: fs.query(nodesCollection, fs.where('identifier', '==', opts.identifier)),
    key: `identifier:${opts.identifier}`,
    factory: getter(() => opts.factory),
  });
};

export const nodeForPath = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{ path: string; factory?: NodeModelFactory<Model> }>,
) => {
  const opts = options(_opts);
  return nodeForQuery({
    ref: fs.query(nodesCollection, fs.where('path', '==', opts.path)),
    key: `path:${opts.path}`,
    factory: getter(() => opts.factory),
  });
};

export const node = {
  forQuery: nodeForQuery,
  forId: nodeForId,
  forIdentifier: nodeForIdentifier,
  forPath: nodeForPath,
};

export type NodesLoaderModelOptions<Model extends NodeModel> = {
  ref: fs.Query;
  key?: string;
  factory?: NodeModelFactory<Model>;
};

export class NodesLoaderModel<Model extends NodeModel = NodeModel> extends Subscribable<
  NodesLoaderModelOptions<Model>
> {
  private readonly _query = queryAll<NodeData>({
    ref: getter(() => this.options.ref),
  });

  private readonly _docs = $derived(this._query.content);

  private readonly _loaded = $derived.by(() => this._docs.filter((doc) => doc.isLoaded));

  private readonly __nodes = mapModels({
    source: getter(() => this._loaded),
    target: (doc) => createNodeModel(doc),
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
    await this.__nodes.load((model) => model.load());
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
  opts: OptionsInput<NodesLoaderModelOptions<Model>>,
) => {
  return new NodesLoaderModel(opts);
};

export const nodesForParentId = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{
    id: string;
    factory?: NodeModelFactory<Model>;
  }>,
) => {
  const opts = options(_opts);
  return nodesForQuery({
    ref: fs.query(nodesCollection, fs.where('parent.id', '==', opts.id)),
    key: `parent:${opts.id}`,
    factory: getter(() => opts.factory),
  });
};

export const nodesForParentPath = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{
    path: string;
    factory?: NodeModelFactory<Model>;
  }>,
) => {
  const opts = options(_opts);
  return nodesForQuery({
    ref: fs.query(nodesCollection, fs.where('parent.path', '==', opts.path)),
    key: `path:${opts.path}`,
    factory: getter(() => opts.factory),
  });
};

export const nodesForParentIdentifier = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{
    identifier: string;
    factory?: NodeModelFactory<Model>;
  }>,
) => {
  const opts = options(_opts);
  return nodesForQuery({
    ref: fs.query(nodesCollection, fs.where('parent.identifier', '==', opts.identifier)),
    key: `identifier:${opts.identifier}`,
    factory: getter(() => opts.factory),
  });
};

export const nodes = {
  forQuery: nodesForQuery,
  forParentId: nodesForParentId,
  forParentPath: nodesForParentPath,
  forParentIdentifier: nodesForParentIdentifier,
};
