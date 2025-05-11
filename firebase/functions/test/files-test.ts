import assert from 'assert';
import { getTestApp, setup } from './helpers/setup';
import { getStorageHelper, storage } from './helpers/storage';
import { firestore, getFirestoreHelper } from './helpers/firestore';
import { ImageFileNodeProperties } from '../shared/nodes/file';
import { FunctionsNodeData } from '../shared/nodes/registry';

describe('files', function () {
  setup(this);
  storage(this);
  firestore(this);

  it('NOW handles image upload', async () => {
    const app = getTestApp(this);
    const storage = getStorageHelper(this);
    const firestore = getFirestoreHelper(this);

    await firestore.recursiveDelete('nodes');

    const file = await storage.uploadFile('film-0647-018.png', 'nodes/image-id/original', {
      filename: 'film-0647-018.png',
      parent: 'parent-id',
    });

    await app.files.onStorageObjectFinalized(file);

    const snapshot = await app.firestore.doc(`nodes/image-id`).get();
    const data = snapshot.data() as FunctionsNodeData<'file'>;
    const properties = data.properties as ImageFileNodeProperties;
    assert.deepStrictEqual(data, {
      kind: 'file',
      identifier: 'film-0647-018',
      parent: 'parent-id',
      properties: {
        type: 'image',
        filename: 'film-0647-018.png',
        original: {
          name: 'nodes/image-id/original',
          contentType: 'image/png',
          size: 2448527,
          dimensions: { width: 2048, height: 1365 },
          url: properties.original.url,
        },
        thumbnails: {
          '100x100': {
            name: 'nodes/image-id/100x100',
            contentType: 'image/jpeg',
            size: 2029,
            dimensions: { width: 100, height: 67 },
            url: properties.thumbnails['100x100'].url,
          },
          '400x400': {
            name: 'nodes/image-id/400x400',
            contentType: 'image/jpeg',
            size: 14100,
            dimensions: { width: 400, height: 267 },
            url: properties.thumbnails['400x400'].url,
          },
          '1024x1024': {
            name: 'nodes/image-id/1024x1024',
            contentType: 'image/jpeg',
            size: 82546,
            dimensions: { width: 1024, height: 683 },
            url: properties.thumbnails['1024x1024'].url,
          },
          '2048x2048': {
            name: 'nodes/image-id/2048x2048',
            contentType: 'image/jpeg',
            size: 374882,
            dimensions: { width: 2048, height: 1365 },
            url: properties.thumbnails['2048x2048'].url,
          },
        },
      },
      createdAt: data.createdAt,
    });
  });
});
