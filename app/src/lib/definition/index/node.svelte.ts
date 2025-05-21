import LucideFlame from '$d2/icons/lucide--flame.svelte';
import { isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { getter } from '$d2/lib/base/utils/options';
import { data } from '$d2/lib/base/utils/property.svelte';
import { FileNodeModel } from '$d2/lib/definition/file/node.svelte';
import { mapNode } from '$d2/lib/nodes/map.svelte';
import { NodeDetailsModel, NodeModel, NodePropertiesModel } from '$d2/lib/nodes/node.svelte';

export class IndexNodePropertiesModel extends NodePropertiesModel<'index'> {
  readonly title = data(this, 'title');
  readonly background = data(this, 'background');

  readonly paths = [this.background];
}

export class IndexNodeDetailsModel extends NodeDetailsModel<'index'> {
  readonly _background = mapNode.forPath({
    path: getter(() => this.path.exceptOwn(this.data.properties.background)),
    factory: FileNodeModel,
  });

  readonly background = $derived(this._background.node?.asImage);

  readonly isLoaded = $derived(isLoaded([this._background]));
  readonly dependencies = [this._background];

  async load() {
    await this._background.load();
  }
}

export class IndexNodeModel extends NodeModel<'index'> {
  readonly properties: IndexNodePropertiesModel = new IndexNodePropertiesModel({ model: this });
  readonly details: IndexNodeDetailsModel = new IndexNodeDetailsModel({ model: this });

  readonly name = 'Index';
  readonly icon = LucideFlame;

  readonly title = $derived(this.data.properties.title);
}
