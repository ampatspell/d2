import { FieldValue, WithFieldValue } from 'firebase-admin/firestore';
import Application from '../app';
import { FileData } from '../files';
import { murl } from '../utils/murl';
import { parse } from 'node:path';
import { FunctionsNodeData } from '../../shared/nodes/registry';
import type { NodeParentData } from '../../shared/documents';

const isNumber = (value: unknown) => {
  if (typeof value === 'number') {
    if (!isNaN(value) && value !== Infinity) {
      return true;
    }
  }
  return false;
};

type NodeFileData = {
  name: string;
  id: string;
  contentType: string;
  size: number;
  filename: string;
  parent: string;
  position: number;
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

  private async onStorageObjectForFileNodeFinalized(opts: NodeFileData) {
    const { id, name, contentType, filename } = opts;

    const processFile = () =>
      this.app.files.processFile({
        name,
        contentType,
        nameForThumbnail: (thumbnail) => `nodes/${id}/${thumbnail}`,
      });

    const loadParent = async () => {
      const snap = await this.app.firestore.doc(`nodes/${opts.parent}`).get();
      const data = snap.data() as FunctionsNodeData;
      if (data) {
        const { id } = snap;
        const { path, identifier } = data;
        return {
          id,
          path,
          identifier,
        } satisfies NodeParentData;
      }
      return null;
    };

    const [file, parent] = await Promise.all([processFile(), loadParent()]);

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

    let path = `/${identifier}`;
    if (parent) {
      path = `${parent.path}/${identifier}`;
    }

    const position = opts.position;

    const data: WithFieldValue<FunctionsNodeData<'file'>> = {
      kind: 'file',
      path,
      identifier,
      position,
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
      const position = parseInt(metadata?.['position'] as string);
      if (filename && parent && isNumber(position)) {
        await this.onStorageObjectForFileNodeFinalized({
          name,
          id,
          contentType: contentType ?? 'application/octet-stream',
          size,
          filename,
          parent,
          position,
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
