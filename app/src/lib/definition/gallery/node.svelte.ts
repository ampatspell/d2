import LucideImages from '$d2/icons/lucide--images.svelte';
import { isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { getter } from '$d2/lib/base/utils/options';
import { data } from '$d2/lib/base/utils/property.svelte';
import { FileNodeModel } from '$d2/lib/definition/file/node.svelte';
import { mapNodes } from '$d2/lib/nodes/map.svelte';
import { NodeDetailsModel } from '$d2/lib/nodes/node/details.svelte';
import { NodeModel } from '$d2/lib/nodes/node/node.svelte';
import { NodePropertiesModel } from '$d2/lib/nodes/node/properties.svelte';

export class GalleryNodePropertiesModel extends NodePropertiesModel<'gallery'> {
  readonly title = data(this, 'title');
  readonly introduction = data(this, 'introduction');
  readonly images = data(this, 'images');

  readonly paths = $derived([this.images]);
}

export class GalleryNodeDetailsModel extends NodeDetailsModel<'gallery'> {
  readonly _images = mapNodes.forParentPath({
    path: getter(() => this.path.exceptParents(this.data.properties.images)),
    factory: FileNodeModel,
    partial: true,
  });

  readonly images = $derived(this._images.nodes);

  readonly dependencies = [this._images];
  readonly isLoaded = $derived(isLoaded([this._images]));

  async load() {
    await this._images.load();
  }
}

export class GalleryNodeModel extends NodeModel<'gallery'> {
  readonly properties: GalleryNodePropertiesModel = new GalleryNodePropertiesModel({ model: this });
  readonly details: GalleryNodeDetailsModel = new GalleryNodeDetailsModel({ model: this });

  readonly name = 'Gallery';
  readonly icon = LucideImages;

  readonly title = $derived(this.data.properties.title);
  readonly introduction = $derived(this.data.properties.introduction);
}
