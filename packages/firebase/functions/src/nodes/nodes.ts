import { NodeData } from '../../shared/documents';
import Application from '../app';
import { NodesFilesService } from './files';

export class NodesService {
  constructor(private readonly app: Application) {}

  get files() {
    return new NodesFilesService(this.app);
  }

  private async deleteChildren(nodeId: string) {
    const childrenSnapshot = await this.app.firestore.collection('nodes').where('parent', '==', nodeId).select().get();
    await Promise.all(
      childrenSnapshot.docs.map(async (nodeSnap) => {
        const ref = nodeSnap.ref;
        await ref.delete();
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onNodeDeleted(nodeId: string, data: NodeData) {
    await this.deleteChildren(nodeId);
  }
}
