import { asIsLoadedModel, isLoaded } from '../base/fire/is-loaded.svelte';
import { Subscribable } from '../base/model/model.svelte';
import { mapModel } from '../base/model/models.svelte';
import { serialized } from '../base/utils/object';
import { getter, options, type OptionsInput } from '../base/utils/options';
import { node, nodes, NodesLoaderModel, type NodeLoaderModel } from './loader.svelte';
import type { NodeModel, NodeModelFactory } from './node.svelte';

export type MapNodeOptions<T, Model extends NodeModel> = {
  source: T;
  loader: (value: T) => NodeLoaderModel<Model> | undefined;
  key?: string;
};

export class MapNode<T, Model extends NodeModel = NodeModel> extends Subscribable<MapNodeOptions<T, Model>> {
  private readonly _source = $derived(this.options.source);

  private readonly _loader = mapModel({
    source: getter(() => this._source),
    target: (arg) => this.options.loader(arg),
  });

  readonly loader = $derived(this._loader.content);
  readonly node = $derived(this.loader?.node);

  async load() {
    await this._loader.load((model) => model.load());
    await this.node?.load();
  }

  readonly key = $derived(this.options.key);

  readonly dependencies = [this._loader];
  readonly isLoaded = $derived(isLoaded([this.node]));
  readonly serialized = $derived(serialized(this, ['key', 'loader', 'node']));
}

export const mapNodeForId = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{
    id: string;
    factory?: NodeModelFactory<Model>;
  }>,
) => {
  const opts = options(_opts);
  return new MapNode<string | undefined, Model>({
    source: getter(() => opts.id),
    key: getter(() => `id:${opts.id}`),
    loader: (id) => {
      if (id) {
        return node.forId({
          id,
          factory: getter(() => opts.factory),
        });
      }
    },
  });
};

export const mapNodeForPath = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{
    path: string | undefined;
    factory?: NodeModelFactory<Model>;
  }>,
) => {
  const opts = options(_opts);
  return new MapNode<string | undefined, Model>({
    source: getter(() => opts.path),
    key: getter(() => `path:${opts.path}`),
    loader: (path) => {
      if (path) {
        return node.forPath({
          path,
          factory: getter(() => opts.factory),
        });
      }
    },
  });
};

export const mapNodeForIdentifier = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{
    identifier: string;
    factory?: NodeModelFactory<Model>;
  }>,
) => {
  const opts = options(_opts);
  return new MapNode<string | undefined, Model>({
    source: getter(() => opts.identifier),
    key: getter(() => `identifier:${opts.identifier}`),
    loader: (identifier) => {
      if (identifier) {
        return node.forIdentifier({
          identifier,
          factory: getter(() => opts.factory),
        });
      }
    },
  });
};

export const mapNode = {
  forId: mapNodeForId,
  forPath: mapNodeForPath,
  nodeForIdentifier: mapNodeForIdentifier,
};

export type MapNodesOptions<T, Model extends NodeModel> = {
  source: T;
  loader: (value: T) => NodesLoaderModel<Model> | undefined;
  key?: string;
};

export class MapNodes<T, Model extends NodeModel = NodeModel> extends Subscribable<MapNodesOptions<T, Model>> {
  private readonly _source = $derived(this.options.source);

  private readonly _loader = mapModel({
    source: getter(() => this._source),
    target: (arg) => this.options.loader(arg),
  });

  readonly loader = $derived(this._loader.content);
  readonly nodes = $derived(this.loader?.nodes || []);

  async load() {
    await this._loader.load((model) => model.load());
    await Promise.all(this.nodes.map((node) => node.load()));
  }

  readonly key = $derived(this.options.key);

  readonly dependencies = [this._loader];
  readonly isLoaded = $derived(isLoaded([this.loader, asIsLoadedModel(this.nodes)]));
  readonly serialized = $derived(serialized(this, ['key', 'loader', 'nodes']));
}

export const mapNodesForParentPath = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{
    path: string | undefined;
    factory?: NodeModelFactory<Model>;
  }>,
) => {
  const opts = options(_opts);
  return new MapNodes({
    source: getter(() => opts.path),
    key: getter(() => `parentPath:${opts.path}`),
    loader: (path) => {
      if (path) {
        return nodes.forParentPath({
          path,
          factory: getter(() => opts.factory),
        });
      }
    },
  });
};

export const mapNodesForParentId = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{
    id: string | undefined;
    factory?: NodeModelFactory<Model>;
  }>,
) => {
  const opts = options(_opts);
  return new MapNodes({
    source: getter(() => opts.id),
    key: getter(() => `parentId:${opts.id}`),
    loader: (id) => {
      if (id) {
        return nodes.forParentId({
          id,
          factory: getter(() => opts.factory),
        });
      }
    },
  });
};

export const mapNodesForParentIdentifier = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<{
    identifier: string | undefined;
    factory?: NodeModelFactory<Model>;
  }>,
) => {
  const opts = options(_opts);
  return new MapNodes({
    source: getter(() => opts.identifier),
    key: getter(() => `parentIdentifier:${opts.identifier}`),
    loader: (identifier) => {
      if (identifier) {
        return nodes.forParentIdentifier({
          identifier,
          factory: getter(() => opts.factory),
        });
      }
    },
  });
};

export const mapNodes = {
  forParentPath: mapNodesForParentPath,
  forParentId: mapNodesForParentId,
  forParentIdentifier: mapNodesForParentIdentifier,
};
