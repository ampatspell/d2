import Application from '../app';
import { NodesFilesService } from './files';
import { NodesPathsService } from './paths';

export class NodesService {
  constructor(private readonly app: Application) {}

  get files() {
    return new NodesFilesService(this.app);
  }

  get paths() {
    return new NodesPathsService(this.app);
  }

  private async deleteChildren(nodeId: string) {
    const snap = await this.app.firestore.collection('nodes').where('parent', '==', nodeId).select().get();
    await Promise.all(
      snap.docs.map(async (snap) => {
        const ref = snap.ref;
        await ref.delete();
      }),
    );
  }

  async onNodeDeleted({ id }: { id: string }) {
    await Promise.all([
      this.files.onNodeDeleted(id),
      this.deleteChildren(id),
      this.app.users.deleteUserNodeForAllUsers(id),
    ]);
  }
}
