import { NodeData } from '../shared/documents';
import Application from './app';
import { murl } from './utils/murl';
import { getDownloadURL } from 'firebase-admin/storage';

export type FileData = {
  name: string;
  contentType?: string;
  size: number;
  metadata?: Record<string, string>;
};

type OriginalPattern = {
  id: string;
};

const originalPattern = murl<OriginalPattern>('nodes/{id}/original');

export class FilesService {
  constructor(private readonly app: Application) {}

  resolvePathForOriginal(path: string) {
    return originalPattern(path) ?? undefined;
  }

  async createFileNode({
    id,
    parent,
    contentType,
    size,
    filename,
    url,
  }: {
    id: string;
    parent: string;
    contentType: string;
    size: number;
    filename: string;
    url: string;
  }) {
    const data: NodeData<'file'> = {
      kind: 'file',
      createdAt: new Date(),
      parent,
      properties: {
        file: {
          original: {
            contentType,
            size,
            filename,
            url,
          },
        },
      },
    };

    const ref = this.app.firestore.doc(`nodes/${id}`);
    await ref.set(data);
  }

  async onStorageObjectFinalized(data: FileData) {
    const { name, contentType, size, metadata } = data;
    console.log({ name, contentType, size, metadata });
    if (metadata) {
      const resolved = this.resolvePathForOriginal(data.name);
      if (resolved) {
        const { id } = resolved;
        const file = this.app.bucket.file(name);
        const url = await getDownloadURL(file);
        await this.createFileNode({
          id,
          contentType: contentType ?? 'application/octet-stream',
          filename: metadata['filename'],
          parent: metadata['parent'],
          size,
          url,
        });
      }
    }
  }
}
