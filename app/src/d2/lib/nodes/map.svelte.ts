import { asIsLoadedModel, isLoaded } from '../base/fire/is-loaded.svelte';
import { Subscribable } from '../base/model/model.svelte';
import { mapModel } from '../base/model/models.svelte';
import { getter, options, type OptionsInput } from '../base/utils/options';
import { node, nodes, NodesLoaderModel, type NodeLoaderModel } from './loader.svelte';
import type { NodeModel, NodeModelFactory } from './node.svelte';

export type MapNodeOptions<T, Model extends NodeModel> = {
  source: T;
  loader: (value: T) => NodeLoaderModel<Model> | undefined;
};

export class MapNode<T, Model extends NodeModel = NodeModel> extends Subscribable<MapNodeOptions<T, Model>> {
  private readonly _loader = mapModel({
    source: getter(() => this.options.source),
    target: (arg) => this.options.loader(arg),
  });

  readonly loader = $derived(this._loader.content);
  readonly node = $derived(this.loader?.node);

  readonly dependencies = [this._loader];
  readonly isLoaded = $derived(isLoaded([this.node]));

  async load() {
    await this._loader.load();
    await this.node?.load();
  }
}

export type MapNodeForPathOptions<Model extends NodeModel> = {
  path: string | undefined;
  factory?: NodeModelFactory<Model>;
};

export const mapNodeForPath = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<MapNodeForPathOptions<Model>>,
) => {
  const opts = options(_opts);
  return new MapNode<string | undefined, Model>({
    source: _opts.path,
    loader: (path) => {
      if (path) {
        return node.forPath(path, opts.factory);
      }
    },
  });
};

export const mapNode = {
  forPath: mapNodeForPath,
};

export type MapNodesOptions<T, Model extends NodeModel> = {
  source: T;
  loader: (value: T) => NodesLoaderModel<Model> | undefined;
};

export class MapNodes<T, Model extends NodeModel = NodeModel> extends Subscribable<MapNodesOptions<T, Model>> {
  private readonly _loader = mapModel({
    source: getter(() => this.options.source),
    target: (arg) => this.options.loader(arg),
  });

  readonly loader = $derived(this._loader.content);
  readonly nodes = $derived(this.loader?.nodes || []);

  readonly dependencies = [this._loader];
  readonly isLoaded = $derived(isLoaded([asIsLoadedModel(this.nodes)]));

  async load() {
    await this._loader.load();
    await Promise.all(this.nodes.map((node) => node.load()));
  }
}

export type MapNodesForParentPathOptions<Model extends NodeModel> = {
  path: string | undefined;
  factory?: NodeModelFactory<Model>;
};

export const mapNodesForParentPath = <Model extends NodeModel = NodeModel>(
  _opts: OptionsInput<MapNodesForParentPathOptions<Model>>,
) => {
  const opts = options(_opts);
  return new MapNodes({
    source: _opts.path,
    loader: (path) => {
      if (path) {
        return nodes.forParentPath(path, opts.factory);
      }
    },
  });
};

export const mapNodes = {
  forParentPath: mapNodesForParentPath,
};
