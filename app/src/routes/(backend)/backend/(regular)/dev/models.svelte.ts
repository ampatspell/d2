import type { Document } from '$d2/lib/base/refactoring/fire/document.svelte';
import { mapModels } from '$d2/lib/base/refactoring/fire/models.svelte';
import { document, queryAll } from '$d2/lib/base/refactoring/fire/query.svelte';
import { SubscribableModel } from '$d2/lib/base/refactoring/subscribable.svelte';
import { getter } from '$d2/lib/base/utils/options';
import type { NodeData } from '$d2/lib/nodes/node/node.svelte';
import { nodesCollection } from '$d2/lib/nodes/nodes.svelte';

export type ItemsModelOptions = undefined;

export class ItemsModel extends SubscribableModel<ItemsModelOptions> {
  readonly query = queryAll<NodeData>({
    ref: nodesCollection,
  });

  readonly models = mapModels({
    source: getter(() => this.query.content),
    target: (doc) => new ItemModel({ doc }),
  });

  readonly dependencies = [this.query, this.models];
}

export type ItemModelOptions = {
  doc: Document<NodeData>;
};

export class ItemModel extends SubscribableModel<ItemModelOptions> {
  readonly doc = $derived(this.options.doc);
  readonly id = $derived(this.doc.id);

  readonly query = document({ ref: getter(() => this.doc.ref) });

  readonly dependencies = [this.query];
}
