import { NodeDocumentModel, NodeModelProperties } from '$d2/lib/nodes/node.svelte';

export class FileNodeProperties extends NodeModelProperties<'file'> {}

export class FileNodeDocumentModel extends NodeDocumentModel<'file'> {
  readonly properties: FileNodeProperties = new FileNodeProperties({ model: this });
}
