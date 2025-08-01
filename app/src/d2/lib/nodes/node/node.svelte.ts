import { serialized } from '$d2/lib/base/utils/object';
import { getter } from '$d2/lib/base/utils/options';
import { UploadFilesModel } from './upload.svelte';
import type { Component } from 'svelte';
import type { BaseNodeData, NodeParentData } from '$d2-shared/documents';
import type { NodePropertiesRegistry } from '$lib/definition/registry';
import { type Property, type PropertyUpdateResult } from '$d2/lib/base/utils/property.svelte';
import { uniq } from '$d2/lib/base/utils/array';
import { getDefinition } from '$d2/lib/definition/app.svelte';
import { isLoaded, type IsLoadedModels } from '$d2/lib/base/fire/is-loaded.svelte';
import { NodePathModel } from './path.svelte';
import { NodeBackendModel, type NodeBackendModelDelegate } from './backend.svelte';
import type { NodePropertiesModel } from './properties.svelte';
import type { NodeDetailsModel } from './details.svelte';
import { SubscribableModel } from '$d2/lib/base/refactoring/subscribable.svelte';
import type { Document } from '$d2/lib/base/refactoring/fire/document.svelte';
import { mapModel } from '$d2/lib/base/refactoring/fire/models.svelte';
import { setGlobal } from '$d2/lib/base/utils/set-global';

export type NodeType = keyof NodePropertiesRegistry;

export type NodeData<Type extends NodeType = NodeType> = BaseNodeData<Type, NodePropertiesRegistry>;

export type NodeModelFactory<Model extends NodeModel> = {
  new (...args: ConstructorParameters<typeof NodeModel<never>>): Model;
};

export const asParent = (node: NodeModel | undefined): NodeParentData | null => {
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

export const nodeDocumentKey = (doc: Document<NodeData>) => {
  return doc.data?.kind;
};

export const is = <Model extends NodeModel>(model: NodeModel, factory: NodeModelFactory<Model>): this is Model => {
  if (model instanceof factory) {
    return true;
  }
  return false;
};

export type NodeModelOptions<Type extends NodeType> = {
  doc: Document<NodeData<Type>>;
  backend: NodeBackendModelDelegate | undefined;
  partial: boolean;
};

export abstract class NodeModel<Type extends NodeType = NodeType> extends SubscribableModel<NodeModelOptions<Type>> {
  readonly doc = $derived(this.options.doc);
  readonly id = $derived(this.doc.id!);
  readonly exists = $derived(this.doc.exists);
  readonly data = $derived(this.doc.data!);
  readonly isBusy = $derived(this.doc.isSaving || this.doc.isDeleting);

  readonly kind = $derived(this.data.kind);
  readonly parent = $derived(this.data.parent ?? undefined);
  readonly position = $derived(this.data.position);
  readonly identifier = $derived(this.data.identifier);
  readonly createdAt = $derived(this.data.createdAt);
  readonly updatedAt = $derived(this.data.updatedAt);

  readonly isPartial = $derived(this.options.partial);

  readonly path = new NodePathModel({
    path: getter(() => this.data.path),
  });

  private readonly _backend = mapModel({
    source: getter(() => this.options.backend),
    target: (delegate) => new NodeBackendModel({ node: this, delegate }),
  });

  readonly backend = $derived(this._backend.content);

  readonly definition = $derived(getDefinition().nodeByType(this.kind));
  readonly name = $derived(this.definition.name);

  abstract readonly properties: NodePropertiesModel<Type>;
  abstract readonly details: NodeDetailsModel<Type>;
  abstract readonly icon: Component;

  async save() {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    this.data.updatedAt = new Date();
    await this.doc.save();
  }

  async updatePaths(opts: PropertyUpdateResult<string>) {
    if (await this.properties.updatePaths(opts)) {
      return this;
    }
  }

  async didUpdateParentIdentifier(parent: NodeParentData) {
    const backend = this.backend;
    if (backend) {
      this.data.parent = parent;
      this.data.path = backend.path;
      return this;
    }
  }

  private async didUpdateIdentifier() {
    const backend = this.backend;
    if (backend) {
      const before = this.data.path;
      const after = backend.path;
      this.data.path = after;

      const global = await this.backend.didUpdatePath({ before, after });
      const children = await this.backend.didUpdateParent(asParent(this)!);
      const nodes = uniq([this, ...global, ...children]);
      await Promise.all(nodes.map((node) => node.save()));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async didUpdate(property: Property, result: PropertyUpdateResult) {
    if (property === this.properties.base.identifier) {
      await this.didUpdateIdentifier();
    } else {
      await this.save();
    }
  }

  buildReorder() {
    let updated = false;
    const hash = {
      parent: (parent: NodeModel | undefined) => {
        if (this.parent?.id !== parent?.id) {
          this.data.parent = asParent(parent);
          updated = true;
        }
        return hash;
      },
      position: (position: number) => {
        if (position !== undefined && this.data.position !== position) {
          this.data.position = position;
          updated = true;
        }
        return hash;
      },
      build: () => {
        if (updated) {
          return {
            node: this,
            save: () => this.didUpdateIdentifier(),
          };
        }
      },
    };
    return hash;
  }

  upload() {
    return new UploadFilesModel({ node: this });
  }

  async load() {
    await this.doc.load();
    if (!this.isPartial) {
      await this.details.load();
    }
  }

  async delete() {
    await this.doc.delete();
  }

  is<Model extends NodeModel>(factory: NodeModelFactory<Model>): this is Model {
    return is(this, factory);
  }

  get nodeIsLoaded(): IsLoadedModels {
    const base = [this.doc];
    if (this.isPartial) {
      return base;
    } else {
      return [...base, this.details];
    }
  }

  readonly isLoaded = $derived(isLoaded(this.nodeIsLoaded));

  get nodeDependencies(): SubscribableModel[] {
    const base = [this.doc, this._backend];
    if (this.isPartial) {
      return base;
    } else {
      return [...base, this.details];
    }
  }

  get dependencies() {
    return this.nodeDependencies;
  }

  readonly serialized = $derived(serialized(this, ['id', 'path']));
}

export const createNodeModel = (
  doc: Document<NodeData>,
  partial: boolean,
  backend: NodeBackendModelDelegate | undefined,
) => {
  return getDefinition().nodeByDocument(doc).model({ doc, partial, backend });
};
