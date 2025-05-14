import { Document } from '$d2/lib/base/fire/document.svelte';
import { Model, Subscribable } from '$d2/lib/base/model/model.svelte';
import { serialized } from '$d2/lib/base/utils/object';
import { getter } from '$d2/lib/base/utils/options';
import { getDefinition } from '../definition/app.svelte';
import { data, DocumentModelProperties, Property, type PropertyUpdateResult } from '../base/utils/property.svelte';
import { UploadFilesModel } from './upload.svelte';
import type { Component } from 'svelte';
import type { BaseNodeData, NodeParentData } from '$d2-shared/documents';
import type { NodePropertiesRegistry } from '$lib/definition/registry';
import { isLoaded } from '../base/fire/is-loaded.svelte';
import type { HasSubscriber } from '../base/model/subscriber.svelte';
import { mapModel } from '../base/model/models.svelte';
import { isTruthy } from '../base/utils/array';

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

export type NodePropertiesModelOptions<Type extends NodeType> = {
  model: NodeModel<Type>;
};

export class NodeBasePropertiesModel<Type extends NodeType> extends DocumentModelProperties<NodeData<Type>> {
  readonly identifier = data(this, 'identifier');
}

export abstract class NodePropertiesModel<
  Type extends NodeType,
  O extends NodePropertiesModelOptions<Type> = NodePropertiesModelOptions<Type>,
> extends Subscribable<O> {
  readonly base = new NodeBasePropertiesModel<Type>({
    model: getter(() => this.options.model),
  });

  readonly data = $derived(this.options.model.data.properties);

  async didUpdate<T>(property: Property<T>, result: PropertyUpdateResult<T>) {
    await this.options.model.didUpdate(property, result);
  }

  abstract readonly paths: Property<string | undefined>[];

  async updatePaths(opts: PropertyUpdateResult<string>) {
    let updated = false;
    this.paths.forEach((prop) => {
      const path = prop.value;
      if (path?.startsWith(opts.before)) {
        const rest = path.substring(opts.before.length, path.length);
        const after = `${opts.after}${rest}`;
        prop.update(after);
        updated = true;
      }
    });
    return updated;
  }
}

export const is = <Model extends NodeModel>(model: NodeModel, factory: NodeModelFactory<Model>): this is Model => {
  if (model instanceof factory) {
    return true;
  }
  return false;
};

export type NodeBackendModelDelegate = {
  parentFor: (node: NodeModel) => NodeModel | undefined;
  childrenFor: (node: NodeModel) => NodeModel[];
  didUpdatePath: (opts: PropertyUpdateResult<string>) => Promise<void>;
};

export type NodeBackendModelOptions<Type extends NodeType> = {
  node: NodeModel<Type>;
  delegate: NodeBackendModelDelegate;
};

export class NodeBackendModel<Type extends NodeType = NodeType> extends Model<NodeBackendModelOptions<Type>> {
  private readonly delegate = $derived(this.options.delegate);
  private readonly node = $derived(this.options.node);

  readonly parent = $derived(this.delegate.parentFor(this.node));
  readonly children = $derived(this.delegate.childrenFor(this.node));

  readonly path: string = $derived.by(() => {
    const parent = this.parent?.backend?.path;
    return [parent, '/', this.node.identifier].filter(isTruthy).join('');
  });

  async didUpdatePath(opts: PropertyUpdateResult<string>) {
    await this.delegate.didUpdatePath(opts);
  }
}

export type NodePathModelOptions = {
  path: string;
};

export class NodePathModel extends Model<NodePathModelOptions> {
  readonly value = $derived(this.options.path);

  exceptOwn(path: string | undefined) {
    if (path === this.value) {
      return undefined;
    }
    return path;
  }

  exceptParents(path: string | undefined) {
    if (typeof path === 'string' && this.value.startsWith(path) && path !== this.value) {
      return undefined;
    }
    return path;
  }

  readonly serialized = $derived(serialized(this, ['value']));
}

export type NodeModelOptions<Type extends NodeType> = {
  doc: Document<NodeData<Type>>;
  backend: NodeBackendModelDelegate | undefined;
};

export abstract class NodeModel<Type extends NodeType = NodeType> extends Subscribable<NodeModelOptions<Type>> {
  readonly doc = $derived(this.options.doc);
  readonly id = $derived(this.doc.id!);
  readonly exists = $derived(this.doc.exists);
  readonly data = $derived(this.doc.data!);
  readonly isBusy = $derived(this.doc.isSaving || this.doc.isDeleting);

  readonly kind = $derived(this.data.kind);
  readonly parent = $derived(this.data.parent ?? undefined);
  readonly identifier = $derived(this.data.identifier);
  readonly createdAt = $derived(this.data.createdAt);
  readonly updatedAt = $derived(this.data.updatedAt);

  readonly path = new NodePathModel({
    path: getter(() => this.data.path),
  });

  private readonly _backend = mapModel({
    source: getter(() => this.options.backend),
    target: (delegate) => new NodeBackendModel({ node: this, delegate }),
  });

  readonly backend = $derived(this._backend.content);

  readonly definition = $derived(getDefinition().byType(this.kind));
  readonly name = $derived(this.definition.name);

  abstract readonly properties: NodePropertiesModel<Type>;
  abstract readonly icon: Component;

  async save() {
    this.data.updatedAt = new Date();
    await this.doc.save();
  }

  async updatePaths(opts: PropertyUpdateResult<string>) {
    if (await this.properties.updatePaths(opts)) {
      await this.save();
    }
  }

  protected async didUpdateParentIdentifier(parent: NodeParentData) {
    const backend = this.backend;
    if (backend) {
      this.data.parent = parent;
      this.data.path = backend.path;
      await this.save();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async didUpdateIdentifier(result: PropertyUpdateResult<string>) {
    const backend = this.backend;
    if (backend) {
      const before = this.data.path;
      const after = backend.path;
      this.data.path = after;
      await this.backend.didUpdatePath({ before, after });
      await Promise.all(backend.children?.map((child) => child.didUpdateParentIdentifier(asParent(this)!)));
    }
  }

  async didUpdate(property: Property, result: PropertyUpdateResult) {
    const identifier = this.properties.base.identifier;
    if (property === this.properties.base.identifier) {
      await this.didUpdateIdentifier(identifier.asResult(result));
    }
    await this.save();
  }

  upload() {
    return new UploadFilesModel({ node: this });
  }

  async load() {
    await this.doc.load();
  }

  async delete() {
    await this.doc.delete();
  }

  is<Model extends NodeModel>(factory: NodeModelFactory<Model>): this is Model {
    return is(this, factory);
  }

  readonly nodeIsLoaded = [this.doc];
  readonly nodeDependencies = [this.doc, this._backend];

  readonly isNodeLoaded = $derived(isLoaded([...this.nodeIsLoaded]));
  readonly isLoaded = $derived(this.isNodeLoaded);
  readonly dependencies: HasSubscriber[] = [...this.nodeDependencies];

  readonly serialized = $derived(serialized(this, ['id', 'path']));
}

export const createNodeModel = (doc: Document<NodeData>, backend: NodeBackendModelDelegate | undefined) => {
  return getDefinition().byDocument(doc).model({ doc, backend });
};
