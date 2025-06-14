import type { ImageFileNodeProperties } from '$d2-shared/nodes/file';
import LucideFileImage from '$d2/icons/lucide--file-image.svelte';
import LucideFile from '$d2/icons/lucide--file.svelte';
import { Model } from '$d2/lib/base/model/model.svelte';
import { data } from '$d2/lib/base/utils/property.svelte';
import { NodeDetailsModel } from '$d2/lib/nodes/node/details.svelte';
import { NodeModel } from '$d2/lib/nodes/node/node.svelte';
import { NodePropertiesModel } from '$d2/lib/nodes/node/properties.svelte';

export class FileNodePropertiesModel extends NodePropertiesModel<'file'> {
  readonly filename = data(this, 'filename');
  readonly paths = [];
}

export class FileNodeDetailsModel extends NodeDetailsModel<'file'> {
  async load() {}
  readonly isLoaded = true;
  readonly dependencies = [];
}

export class FileNodeModel extends NodeModel<'file'> {
  readonly properties: FileNodePropertiesModel = new FileNodePropertiesModel({ model: this });
  readonly details: FileNodeDetailsModel = new FileNodeDetailsModel({ model: this });

  readonly type = $derived(this.data.properties.type);
  readonly original = $derived(this.data.properties.original);
  readonly filename = $derived(this.data.properties.filename);

  readonly isRegular = $derived(this.type === 'regular');
  readonly isImage = $derived(this.type === 'image');

  readonly asImage = $derived.by(() => {
    if (this.isImage) {
      return new FileNodeImageModel({ node: this });
    }
  });

  readonly name = 'File';
  readonly icon = $derived(this.isImage ? LucideFileImage : LucideFile);
}

type FileNodeImageModelOptions = {
  node: FileNodeModel;
};

export class FileNodeImageModel extends Model<FileNodeImageModelOptions> {
  readonly node = $derived(this.options.node);
  readonly properties = $derived(this.node.data.properties as ImageFileNodeProperties);
  readonly original = $derived(this.properties.original);
  readonly thumbnails = $derived(this.properties.thumbnails);
}
