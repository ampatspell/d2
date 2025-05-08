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

const nodeDocumentForId = (id: string) => {
  return new Document<NodeData<never>>({
    ref: fs.doc(nodesCollection, id),
  });
};

export const nodeDocumentKey = (doc: Document<NodeData>) => {
  return doc.data?.kind;
};

export type NodeDocumentModelOptions<Type extends NodeType> = {
  doc: Document<NodeData<Type>>;
};

export class NodeDocumentModel<Type extends NodeType = NodeType> extends Subscribable<NodeDocumentModelOptions<Type>> {
  readonly doc = $derived(this.options.doc);
  readonly id = $derived(this.doc.id!);
  readonly exists = $derived(this.doc.exists);
  readonly data = $derived(this.doc.data!);
  readonly kind = $derived(this.data.kind);
  readonly parentId = $derived(this.data.parent);

  readonly definition = $derived(getDefinition().byType(this.kind));

  async save() {
    await this.doc.save();
  }

  async load() {
    await this.doc.load();
  }

  readonly isLoaded = $derived(isLoaded([this.doc]));
  readonly dependencies = [this.doc];
  readonly serialized = $derived(serialized(this, ['id']));

  // static buildNew<Type extends NodeType>({ data }: { data: NodeData<Type> }) {
  //   return new this({
  //     doc: new Document<NodeData<Type>>({
  //       ref: fs.doc(nodesCollection),
  //       data,
  //     }),
  //   });
  // }
}

export class NodeDocumentModelLoader extends Subscribable<{ doc: Document<NodeData<never>> }> {
  readonly doc = $derived(this.options.doc);
  readonly id = $derived(this.doc.id);
  readonly kind = $derived(this.doc.data?.kind);

  private readonly _loaded = $derived.by(() => {
    const doc = this.doc;
    if (doc.isLoaded) {
      return doc;
    }
  });

  readonly _node = mapModel({
    source: getter(() => this._loaded),
    target: (doc) => createNodeDocumentModel(doc),
    key: nodeDocumentKey,
  });

  readonly node = $derived(this._node.content!);

  async load() {
    await this.doc.load();
    await this.node.load();
  }

  readonly dependencies = [this.doc, this._node];
  readonly serialized = $derived(serialized(this, ['id', 'kind']));
  readonly isLoaded = $derived(isLoaded([this.doc, this.node]));

  static forId(id: string) {
    return new this({ doc: nodeDocumentForId(id) });
  }
}

export const createNodeDocumentModel = (doc: Document<NodeData>) => {
  return getDefinition().byDocument(doc)?.model({ doc });
};
