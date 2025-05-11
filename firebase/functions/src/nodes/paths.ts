import { FieldValue } from 'firebase-admin/firestore';
import Application from '../app';
import { FunctionsNodeData } from '../../shared/nodes/registry';
import { NodeParentData } from '../../shared/documents';

export class NodesPathsService {
  constructor(private readonly app: Application) {}

  async updateOwn({ id, data }: { id: string; data: FunctionsNodeData }) {
    const parentId = data.parent?.id;
    let path = `/${data.identifier}`;
    if (parentId) {
      const snap = await this.app.firestore.doc(`nodes/${parentId}`).get();
      const parent = snap.data() as FunctionsNodeData | undefined;
      if (parent) {
        path = `${parent.path}/${data.identifier}`;
      }
    }
    console.log('update-own', id);
    await this.app.firestore.doc(`nodes/${id}`).set(
      {
        path,
        _token: FieldValue.delete(),
      },
      { merge: true },
    );
  }

  async updateChildren({ id, data }: { id: string; data: FunctionsNodeData }) {
    const snap = await this.app.firestore.collection('nodes').where('parent.id', '==', id).get();
    await Promise.all(
      snap.docs.map(async (snap) => {
        const node = snap.data() as FunctionsNodeData;
        const path = `${data.path}/${node.identifier}`;
        console.log('update-children', id, snap.id);
        await snap.ref.set(
          {
            path,
            parent: {
              id,
              path: data.path,
              identifier: data.identifier,
            } satisfies NodeParentData,
            _token: FieldValue.delete(),
          },
          { merge: true },
        );
      }),
    );
  }
}
