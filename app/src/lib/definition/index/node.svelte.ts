import LucideFlame from '$d2/icons/lucide--flame.svelte';
import { isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { getter } from '$d2/lib/base/utils/options';
import { data } from '$d2/lib/base/utils/property.svelte';
import { FileNodeModel } from '$d2/lib/definition/file/node.svelte';
import { mapNode } from '$d2/lib/nodes/map.svelte';
import { NodeModel, NodePropertiesModel } from '$d2/lib/nodes/node.svelte';

export class IndexNodePropertiesModel extends NodePropertiesModel<'index'> {
  title = data(this, 'title');
  background = data(this, 'background');
}

export class IndexNodeModel extends NodeModel<'index'> {
  readonly properties: IndexNodePropertiesModel = new IndexNodePropertiesModel({
    model: this,
  });

  readonly name = 'Index';
  readonly icon = LucideFlame;

  readonly title = $derived(this.data.properties.title);

  readonly background = mapNode.forPath({
    path: getter(() => this.path.exceptOwn(this.data.properties.background)),
    factory: FileNodeModel,
  });

  readonly isLoaded = $derived(isLoaded([...this.nodeIsLoaded, this.background]));
  readonly dependencies = [...this.nodeDependencies, this.background];
}
