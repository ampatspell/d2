import LucideFlame from '$d2/icons/lucide--flame.svelte';
import { data } from '$d2/lib/base/utils/property.svelte';
import { NodeDocumentModel, NodeModelProperties } from '$d2/lib/nodes/node.svelte';

export class MissingNodeProperties extends NodeModelProperties<'missing'> {
  message = data(this, 'message');
}

export class MissingNodeDocumentModel extends NodeDocumentModel<'missing'> {
  readonly properties: MissingNodeProperties = new MissingNodeProperties({
    model: this,
  });

  readonly name = 'Missing';
  readonly icon = LucideFlame;
}
