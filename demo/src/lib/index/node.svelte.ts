import LucideFlame from '$d2/icons/lucide--flame.svelte';
import { isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { data } from '$d2/lib/base/utils/property.svelte';
import { NodeDocumentModel, NodeModelProperties } from '$d2/lib/nodes/node.svelte';

export class IndexNodeProperties extends NodeModelProperties<'index'> {
  title = data(this, 'title');
  background = data(this, 'background');
}

export class IndexNodeDocumentModel extends NodeDocumentModel<'index'> {
  readonly properties: IndexNodeProperties = new IndexNodeProperties({
    model: this,
  });

  readonly name = 'Index';
  readonly icon = LucideFlame;

  readonly title = $derived(this.data.properties.title);

  readonly isLoaded = $derived(isLoaded([...this.nodeIsLoaded]));
  readonly dependencies = [...this.nodeDependencies]
}
