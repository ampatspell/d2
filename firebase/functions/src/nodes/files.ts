import { FieldValue, WithFieldValue } from 'firebase-admin/firestore';
import Application from '../app';
import { FileData } from '../files';
import { murl } from '../utils/murl';
import { parse } from 'node:path';
import { FunctionsNodeData } from '../../shared/nodes/registry';

type NodeFileData = {
  name: string;
  id: string;
  contentType: string;
  size: number;
  filename: string;
  parent: string;
};

type OriginalPattern = {
  id: string;
};

const nodeFileOriginalPattern = murl<OriginalPattern>('nodes/{id}/original');

export class NodesFilesService {
  constructor(private readonly app: Application) {}

  private resolveFileOriginalPattern(path: string) {
    return nodeFileOriginalPattern(path) ?? undefined;
  }

  private async onStorageObjectForFileNodeFinalized({ id, name, contentType, parent, filename }: NodeFileData) {
    const file = await this.app.files.processFile({
      name,
      contentType,
      nameForThumbnail: (thumbnail) => `nodes/${id}/${thumbnail}`,
    });

    let properties: FunctionsNodeData<'file'>['properties'];

    if (file.type === 'image') {
      const { original, thumbnails } = file;
      properties = {
        type: 'image',
        filename,
        original,
        thumbnails,
      };
    } else if (file.type === 'regular') {
      const { original } = file;
      properties = {
        type: 'regular',
        filename,
        original,
      };
    } else {
      return;
    }

    const identifier = parse(filename).name;

    const data: WithFieldValue<FunctionsNodeData<'file'>> = {
      kind: 'file',
      path: '__pending__',
      identifier,
      parent,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      properties,
    };

    const ref = this.app.firestore.doc(`nodes/${id}`);
    await ref.set(data);
  }

  async onStorageObjectFinalized(data: FileData) {
    const { name, contentType, size, metadata } = data;
    const resolved = this.resolveFileOriginalPattern(name);
    if (resolved) {
      const { id } = resolved;
      const filename = metadata?.['filename'];
      const parent = metadata?.['parent'];
      if (filename && parent) {
        await this.onStorageObjectForFileNodeFinalized({
          name,
          id,
          contentType: contentType ?? 'application/octet-stream',
          size,
          filename,
          parent,
        });
      }
      return true;
    }
    return false;
  }

  async onNodeDeleted(id: string) {
    const [files] = await this.app.bucket.getFiles({ prefix: `nodes/${id}` });
    await Promise.all(files.map((file) => file.delete()));
  }
}
