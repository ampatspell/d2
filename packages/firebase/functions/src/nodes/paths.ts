import { FieldValue } from 'firebase-admin/firestore';
import { NodeData } from '../../shared/documents';
import Application from '../app';

export class NodesPathsService {
  constructor(private readonly app: Application) {}

  async updateOwn({ id, data }: { id: string; data: NodeData }) {
    const parentId = data.parent;
    let path = `/${data.identifier}`;
    if (parentId) {
      const snap = await this.app.firestore.doc(`nodes/${parentId}`).get();
      const parent = snap.data() as NodeData | undefined;
      if (parent) {
        path = `${parent.path}/${data.identifier}`;
      }
    }
    if (data.path !== path) {
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
    const snap = await this.app.firestore.collection('nodes').where('parent', '==', id).get();
    await Promise.all(
      snap.docs.map(async (snap) => {
        const node = snap.data() as NodeData;
        const path = `${data.path}/${node.identifier}`;
        if (node.path !== path) {
          await snap.ref.set(
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
