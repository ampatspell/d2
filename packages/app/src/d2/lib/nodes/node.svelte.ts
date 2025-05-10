import * as fs from '@firebase/firestore';
import type { NodeData, NodeType } from '$d2-shared/documents';
import { Document } from '$d2/lib/base/fire/document.svelte';
import { Subscribable } from '$d2/lib/base/model/model.svelte';
import { isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { serialized } from '$d2/lib/base/utils/object';
import { mapModel } from '$d2/lib/base/model/models.svelte';
import { getter } from '$d2/lib/base/utils/options';
import { nodesCollection } from './nodes.svelte';
import { getDefinition } from '../definition/app.svelte';
import { data, DocumentModelProperties } from '../base/utils/property.svelte';
import { UploadFilesModel } from './upload.svelte';
import { queryFirst } from '../base/fire/query.svelte';

export const nodeDocumentKey = (doc: Document<NodeData>) => {
  return doc.data?.kind;
};

export type NodeModelPropertiesOptions<Type extends NodeType> = {
  model: NodeDocumentModel<Type>;
};

export class NodeModelBaseProperties<Type extends NodeType> extends DocumentModelProperties<NodeData<Type>> {
  readonly createdAt = data(this, 'createdAt');
  readonly identifier = data(this, 'identifier');
}

export class NodeModelProperties<
  Type extends NodeType,
  O extends NodeModelPropertiesOptions<Type> = NodeModelPropertiesOptions<Type>,
> extends Subscribable<O> {
  readonly base = new NodeModelBaseProperties<Type>({
    model: getter(() => this.options.model),
  });

  readonly data = $derived(this.options.model.data.properties);

  async didUpdate() {
    await this.options.model.save();
  }
}

export type NodeDocumentModelOptions<Type extends NodeType> = {
  doc: Document<NodeData<Type>>;
};

export abstract class NodeDocumentModel<Type extends NodeType = NodeType> extends Subscribable<
  NodeDocumentModelOptions<Type>
> {
  readonly doc = $derived(this.options.doc);
  readonly id = $derived(this.doc.id!);
  readonly path = $derived(this.doc.path!);
  readonly exists = $derived(this.doc.exists);
  readonly data = $derived(this.doc.data!);
  readonly kind = $derived(this.data.kind);
  readonly parentId = $derived(this.data.parent);
  readonly identifier = $derived(this.data.identifier);

  readonly definition = $derived(getDefinition().byType(this.kind));

  abstract readonly properties: NodeModelProperties<Type>;

  async save() {
    await this.doc.save();
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

  readonly isLoaded = $derived(isLoaded([this.doc]));
  readonly dependencies = [this.doc];
  readonly serialized = $derived(serialized(this, ['id']));
}

export class NodeDocumentModelLoader extends Subscribable<{ ref: fs.Query }> {
  private _query = queryFirst<NodeData>({
    ref: getter(() => this.options.ref),
  });

  readonly doc = $derived(this._query.content);

  private readonly _loaded = $derived.by(() => {
    const doc = this.doc;
    if (doc?.isLoaded) {
      return doc;
    }
  });

  readonly _node = mapModel({
    source: getter(() => this._loaded),
    target: (doc) => createNodeDocumentModel(doc),
    key: nodeDocumentKey,
  });

  readonly node = $derived(this._node.content);

  async load() {
    await this._query.load();
    await this._node.load();
    await this.node?.load();
  }

  readonly dependencies = [this._query, this._node];
  readonly serialized = $derived(serialized(this, []));
  readonly isLoaded = $derived(isLoaded([this._query, this.node]));

  static forQuery(ref: fs.Query) {
    return new this({ ref });
  }

  static forId(id: string) {
    return this.forQuery(fs.query(nodesCollection, fs.where(fs.documentId(), '==', id)));
  }

  static forIdentifier(identifier: string) {
    return this.forQuery(fs.query(nodesCollection, fs.where('identifier', '==', identifier), fs.limit(1)));
  }

}

export const createNodeDocumentModel = (doc: Document<NodeData>) => {
  return getDefinition().byDocument(doc)?.model({ doc });
};
