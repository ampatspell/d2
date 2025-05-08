import { data } from '$d2/lib/base/utils/property.svelte';
import { NodeDocumentModel, NodeModelProperties } from '$d2/lib/nodes/node.svelte';

export class MissingNodeProperties extends NodeModelProperties<'missing'> {
  message = data(this, 'message');
}

export class MissingNodeDocumentModel extends NodeDocumentModel<'missing'> {
  readonly properties = new MissingNodeProperties({
    model: this,
  });
}
