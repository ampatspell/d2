import LucideFlame from '$d2/icons/lucide--flame.svelte';
import { data } from '$d2/lib/base/utils/property.svelte';
import { NodeDocumentModel, NodeModelProperties } from '$d2/lib/nodes/node.svelte';

export class BlankNodeProperties extends NodeModelProperties<'blank'> {
  title = data(this, 'title');
}

export class BlankNodeDocumentModel extends NodeDocumentModel<'blank'> {
  readonly properties: BlankNodeProperties = new BlankNodeProperties({
    model: this,
  });

  readonly name = 'Blank';
  readonly icon = LucideFlame;

  readonly title = $derived(this.data.properties.title);
}
