import { FieldValue } from 'firebase-admin/firestore';
import { NodeData } from '../../shared/documents';
import Application from '../app';

export class NodesPathsService {
  constructor(private readonly app: Application) {}

  async updateOwn({ id, data }: { id: string; data: NodeData }) {
    const parentId = data.parent;
    let path = `/${data.identifier}`;
    if (parentId) {
      const parentSnap = await this.app.firestore.doc(`nodes/${parentId}`).get();
      const parentData = parentSnap.data() as NodeData | undefined;
      if (parentData) {
        path = `${parentData.path}/${data.identifier}`;
      }
    }
    if (data.path !== path) {
      console.log('set-path own', id, path);
      await this.app.firestore.doc(`nodes/${id}`).set(
        {
          path,
          _token: FieldValue.delete(),
        },
        { merge: true },
      );
    }
  }

  async updateChildren({ id, data }: { id: string; data: NodeData }) {
    const childrenSnapshot = await this.app.firestore.collection('nodes').where('parent', '==', id).get();
    await Promise.all(
      childrenSnapshot.docs.map(async (nodeSnap) => {
        const nodeData = nodeSnap.data() as NodeData;
        const path = `${data.path}/${nodeData.identifier}`;
        if (nodeData.path !== path) {
          console.log('set-path children', id, nodeSnap.ref.id, path);
          await nodeSnap.ref.set(
            {
              path,
              _token: FieldValue.delete(),
            },
            { merge: true },
          );
        }
      }),
    );
  }
}
