import Application from './app';

export class NodesService {
  constructor(private readonly app: Application) {}

  private async deleteChildren(nodeId: string) {
    const childrenSnapshot = await this.app.firestore.collection('nodes').where('parent', '==', nodeId).select().get();
    await Promise.all(
      childrenSnapshot.docs.map(async (nodeSnap) => {
        const ref = nodeSnap.ref;
        await ref.delete();
      }),
    );
  }

  async onNodeDeleted(nodeId: string) {
    await this.deleteChildren(nodeId);
  }
}
