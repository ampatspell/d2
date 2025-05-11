import type { ImageFileNodeProperties } from '$d2-shared/nodes/file';
import LucideFileImage from '$d2/icons/lucide--file-image.svelte';
import LucideFile from '$d2/icons/lucide--file.svelte';
import { Model } from '$d2/lib/base/model/model.svelte';
import { data } from '$d2/lib/base/utils/property.svelte';
import { NodeDocumentModel, NodeModelProperties } from '$d2/lib/nodes/node.svelte';

export class FileNodeProperties extends NodeModelProperties<'file'> {
  readonly filename = data(this, 'filename');
}

export class FileNodeDocumentModel extends NodeDocumentModel<'file'> {
  readonly properties: FileNodeProperties = new FileNodeProperties({ model: this });

  readonly type = $derived(this.data.properties.type);

  readonly isRegular = $derived(this.type === 'regular');
  readonly isImage = $derived(this.type === 'image');

  readonly original = $derived(this.data.properties.original);

  readonly asImage = $derived.by(() => {
    if (this.isImage) {
      return new FileNodeImageModel({ node: this });
    }
  });

  readonly name = 'File';
  readonly icon = $derived(this.isImage ? LucideFileImage : LucideFile);
}

type FileNodeImageModelOptions = {
  node: FileNodeDocumentModel;
};

export class FileNodeImageModel extends Model<FileNodeImageModelOptions> {
  readonly node = $derived(this.options.node);
  readonly properties = $derived(this.node.data.properties as ImageFileNodeProperties);
  readonly original = $derived(this.properties.original);
  readonly thumbnails = $derived(this.properties.thumbnails);
}
