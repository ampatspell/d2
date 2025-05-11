import LucideFileImage from '$d2/icons/lucide--file-image.svelte';
import LucideFile from '$d2/icons/lucide--file.svelte';
import { NodeDocumentModel, NodeModelProperties } from '$d2/lib/nodes/node.svelte';

export class FileNodeProperties extends NodeModelProperties<'file'> {}

export class FileNodeDocumentModel extends NodeDocumentModel<'file'> {
  readonly properties: FileNodeProperties = new FileNodeProperties({ model: this });

  readonly type = $derived(this.data.properties.type);

  readonly name = 'File';
  readonly icon = $derived(this.type === 'image' ? LucideFileImage : LucideFile);
}
