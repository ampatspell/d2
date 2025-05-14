import type { ImageFileNodeProperties } from '$d2-shared/nodes/file';
import LucideFileImage from '$d2/icons/lucide--file-image.svelte';
import LucideFile from '$d2/icons/lucide--file.svelte';
import { isLoaded } from '$d2/lib/base/fire/is-loaded.svelte';
import { Model } from '$d2/lib/base/model/model.svelte';
import { data } from '$d2/lib/base/utils/property.svelte';
import { NodeModel, NodePropertiesModel } from '$d2/lib/nodes/node.svelte';

export class FileNodePropertiesModel extends NodePropertiesModel<'file'> {
  readonly filename = data(this, 'filename');
  readonly paths = [];
}

export class FileNodeModel extends NodeModel<'file'> {
  readonly properties: FileNodePropertiesModel = new FileNodePropertiesModel({ model: this });

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

  readonly isLoaded = $derived(isLoaded([...this.nodeIsLoaded]));
  readonly dependencies = [...this.nodeDependencies];
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
