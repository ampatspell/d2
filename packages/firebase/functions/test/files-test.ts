// import assert from 'assert';
import { getTestApp, setup } from './helpers/setup';
import { getStorageHelper, storage } from './helpers/storage';
import { firestore, getFirestoreHelper } from './helpers/firestore';

describe('files', function () {
  setup(this);
  storage(this);
  firestore(this);

  it('NOW handles image upload', async () => {
    const app = getTestApp(this);
    const storage = getStorageHelper(this);
    const firestore = getFirestoreHelper(this);

    await firestore.recursiveDelete('nodes');

    const data = await storage.uploadFile('film-0647-018.png', 'nodes/image-id/original', {
      filename: 'film-0647-018.png',
      parent: 'parent-id',
    });

    await app.files.onStorageObjectFinalized(data);
  });
});
