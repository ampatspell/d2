import path, { extname } from 'path';
import Application from '../../src/app';
import { getTestApp } from './setup';
import { readFile } from 'node:fs/promises';
import { getDownloadURL } from 'firebase-admin/storage';

const mimeTypes = {
  '.png': 'image/png',
  '.txt': 'text/plain',
};

export class StorageHelper {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async loadBuffer(name: string) {
    return await readFile(path.join(__dirname, 'files', name));
  }

  contentTypeFor(name: string) {
    const ext = extname(name);
    return mimeTypes[ext] ?? 'application/octet-stream';
  }

  async uploadFile(source: string, target: string, metadata?: Record<string, unknown>) {
    const buffer = await this.loadBuffer(source);
    const file = this.app.bucket.file(target);
    const contentType = this.contentTypeFor(source);
    await file.save(buffer, {
      resumable: false,
      contentType,
      metadata: {
        metadata,
      },
    });

    const [url, meta] = await Promise.all([getDownloadURL(file), this.getMetadata(target)]);

    const size = meta!.size!;

    return {
      name: meta!.name!,
      contentType,
      size: typeof size === 'number' ? size : parseInt(size),
      metadata: meta!.metadata as Record<string, string>,
      url,
    };
  }

  async getMetadata(name: string) {
    const file = this.app.bucket.file(name);
    try {
      const [metadata] = await file.getMetadata();
      return metadata;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.code === 404) {
        return undefined;
      }
      throw err;
    }
  }
}

export const storage = (suite: Mocha.Suite) => {
  suite.beforeEach(() => {
    const app = getTestApp(suite);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (suite as any).storage = new StorageHelper(app);
  });
};

export const getStorageHelper = (suite: Mocha.Suite) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (suite as any).storage as StorageHelper;
};
