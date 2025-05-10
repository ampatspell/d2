import Application from './app';

export class UsersService {
  constructor(private readonly app: Application) {}

  async deleteUserNodeForAllUsers(id: string) {
    const snap = await this.app.firestore.collection('users').select().get();
    await Promise.all(
      snap.docs.map(async (user) => {
        await user.ref.collection('nodes').doc(id).delete();
      }),
    );
  }
}
