import * as fs from '@firebase/firestore';
import { Subscribable } from '../base/model/model.svelte';
import { firebase } from '../base/fire/firebase.svelte';
import { isLoaded } from '../base/fire/is-loaded.svelte';
import { serialized } from '../base/utils/object';
import { queryAll } from '../base/fire/query.svelte';
import { getter, options } from '../base/utils/options';
import { mapModels } from '../base/model/models.svelte';
import {
  asParent,
  createNodeModel,
  nodeDocumentKey,
  NodeModel,
  type NodeBackendModelDelegate,
  type NodeData,
} from './node.svelte';
import type { NodeDefinitionModel } from '../definition/node.svelte';
import { Document } from '../base/fire/document.svelte';
import type { TreeOnReorder } from '$d2/components/dark/tree/tree.svelte';
import type { NodesTreeSettings } from '$d2/components/backend/nodes/tree/models.svelte';

export const nextPosition = (nodes: NodeModel[]) => {
  if (nodes.length) {
    return Math.max(...nodes.map((child) => child.position ?? 0)) + 1;
  }
  return 0;
};

export const nodesCollection = fs.collection(firebase.firestore, 'nodes');

export type NodesModelOptions = {
  query: fs.Query;
};

export class NodesModel extends Subscribable<NodesModelOptions> {
  private readonly _query = queryAll<NodeData>({
    ref: getter(() => this.options.query),
  });

  private readonly _delegate: NodeBackendModelDelegate = options({
    parentFor: (node) => this.byId(node.parent?.id),
    childrenFor: (node) => this.byParentId(node.id),
    didUpdatePath: (opts) => Promise.all(this.all.map((node) => node.updatePaths(opts))),
  });

  private readonly _nodes = mapModels({
    source: getter(() => this._query.content),
    target: (doc) => createNodeModel(doc, this._delegate),
    key: nodeDocumentKey,
    sort: [{ value: (node) => node.position }],
  });

  readonly all = $derived(this._nodes.sorted);

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

  async reorder(opts: TreeOnReorder<NodeModel> & { settings: NodesTreeSettings }) {
    console.log(opts.source.path.value, opts.position, opts.target.path.value);

    const { source, position, settings } = opts;
    let target: NodeModel | undefined = opts.target;

    if (position === 'over') {
      const nodes = this.byParentId(target.id);
      const position = nextPosition(nodes);
      await source.updateParent(target, position);
    } else {
      const isOpen = settings.isOpen(target.id) && this.byParentId(target.id).length > 0;
      if (!isOpen) {
        target = this.byId(target.parent?.id);
      }
      const nodes = this.byParentId(target?.id ?? null);
      if (position === 'before') {
        await Promise.all(
          nodes.map(async (node, idx) => {
            await node.updateParent(target, idx + 1);
          }),
        );
        await source.updateParent(target, 0);
      } else if (position === 'after') {
        const position = nextPosition(nodes);
        await source.updateParent(target, position);
      }
    }

    // reorder previous parent
  }

  async create({ parent, definition }: { parent: NodeModel | undefined; definition: NodeDefinitionModel }) {
    const ref = fs.doc(nodesCollection);
    const now = new Date();
    const identifier = ref.id;

    let path = `/${identifier}`;
    let position = 0;
    if (parent) {
      path = `${parent.path.value}/${identifier}`;
      if (parent.backend) {
        position = nextPosition(parent.backend.children);
      }
    } else {
      position = nextPosition(this.byParentId(null));
    }

    const properties = definition.defaults({
      path,
    });

    if (properties) {
      const data: NodeData = {
        kind: definition.type,
        path,
        identifier,
        parent: asParent(parent),
        position,
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
