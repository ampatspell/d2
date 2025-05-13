import LucideFlame from '$d2/icons/lucide--flame.svelte';
import { isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { getter } from '$d2/lib/base/utils/options';
import { data } from '$d2/lib/base/utils/property.svelte';
import { FileNodeDocumentModel } from '$d2/lib/definition/file/node.svelte';
import { mapNodes } from '$d2/lib/nodes/map.svelte';
import { NodeModel, NodePropertiesModel } from '$d2/lib/nodes/node.svelte';

export class GalleryNodePropertiesModel extends NodePropertiesModel<'gallery'> {
  readonly title = data(this, 'title');
  readonly images = data(this, 'images');
}

export class GalleryNodeModel extends NodeModel<'gallery'> {
  readonly properties: GalleryNodePropertiesModel = new GalleryNodePropertiesModel({
    model: this,
  });

  readonly name = 'Gallery';
  readonly icon = LucideFlame;

  readonly title = $derived(this.data.properties.title);

  private readonly _images = mapNodes.forParentPath({
    path: getter(() => this.path.exceptParents(this.data.properties.images)),
    factory: FileNodeDocumentModel,
  });

  readonly images = $derived(this._images.nodes);

  async load() {
    await super.load();
    await this._images.load();
  }

  readonly dependencies = [...this.nodeDependencies, this._images];
  readonly isLoaded = $derived(isLoaded([...this.nodeIsLoaded, this._images]));
}
