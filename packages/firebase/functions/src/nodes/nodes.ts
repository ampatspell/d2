import { NodeData } from '../../shared/documents';
import Application from '../app';
import { NodesFilesService } from './files';
import { NodesPathsService } from './path';

export class NodesService {
  constructor(private readonly app: Application) {}

  get files() {
    return new NodesFilesService(this.app);
  }

  get paths() {
    return new NodesPathsService(this.app);
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

  async onNodeCreated(opts: { id: string; data: NodeData }) {
    await this.paths.updateOwn(opts);
  }

  async onNodeDeleted({ id }: { id: string }) {
    await Promise.all([this.files.onNodeDeleted(id), this.deleteChildren(id)]);
  }

  async onNodeUpdated({ id, before, after }: { id: string; before: NodeData; after: NodeData }) {
    if (before.identifier !== after.identifier) {
      await this.paths.updateOwn({ id, data: after });
    } else if (before.path !== after.path) {
      await this.paths.updateChildren({ id, data: after });
    }
  }
}
