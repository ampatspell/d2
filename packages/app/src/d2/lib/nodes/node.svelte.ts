import * as fs from '@firebase/firestore';
import type { NodeData, NodeType } from '$d2-shared/documents';
import { Document } from '../base/fire/document.svelte';
import { isLoaded } from '../base/fire/is-loaded.svelte';
import { Subscribable } from '../base/model/model.svelte';
import { serialized } from '../base/utils/object';
import { nodesCollection } from './nodes.svelte';

export type NodeDocumentModelOptions<Type extends NodeType> = {
  doc: Document<NodeData<Type>>;
};

export class NodeDocumentModel<Type extends NodeType> extends Subscribable<NodeDocumentModelOptions<Type>> {
  readonly doc = $derived(this.options.doc);
  readonly id = $derived(this.doc.id!);
  readonly exists = $derived(this.doc.exists);
  readonly data = $derived(this.doc.data);

  async save() {
    await this.doc.save();
  }

  async load() {
    await this.doc.load();
  }

  readonly isLoaded = $derived(isLoaded([this.doc]));
  readonly dependencies = [this.doc];
  readonly serialized = $derived(serialized(this, ['id']));

  static buildNew<Type extends NodeType>({ data }: { data: NodeData<Type> }) {
    return new this({
      doc: new Document<NodeData<Type>>({
        ref: fs.doc(nodesCollection),
        data,
      }),
    });
  }

  static documentForId(id: string) {
    return new Document<NodeData<never>>({
      ref: fs.doc(nodesCollection, id),
    });
  }

  static forId(id: string) {
    return new this({ doc: this.documentForId(id) });
  }

}
