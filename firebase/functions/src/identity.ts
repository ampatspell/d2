import { AuthUserRecord } from 'firebase-functions/v2/identity';
import Application from './app';
import { UserRecord } from 'firebase-admin/auth';
import { AuthData } from 'firebase-functions/v2/tasks';
import { WithAdminResponse } from '../shared/functions';
import { UserData, UserRole } from '../shared/documents';
import { BeforeCreateResponse } from 'firebase-functions/lib/common/providers/identity';
import { compact, converter } from './utils/firestore';

export const ADMIN = 'admin';

export class IdentityService {
  constructor(private readonly app: Application) {}

  get firestore() {
    return this.app.firestore;
  }

  usersRef() {
    return this.firestore.collection('users').withConverter(converter<UserData>());
  }

  userRef(id: string) {
    return this.usersRef().doc(id).withConverter(converter<UserData>());
  }

  async onBeforeUserCreated(record: AuthUserRecord): Promise<BeforeCreateResponse> {
    const role: UserRole = 'visitor';
    const ref = this.userRef(record.uid);

    await ref.set(
      compact({
        email: record.email,
        isAnonymous: !record.email,
        role,
      }),
    );

    return {
      customClaims: { role },
    };
  }

  //

  async getUserByUid(uid: string) {
    return this.app.auth.getUser(uid);
  }

  getRole(user: UserRecord) {
    return user.customClaims?.role;
  }

  isAdmin(user: UserRecord) {
    const admin = this.app.config.adminEmail.value();
    return this.getRole(user) === ADMIN || user.email === admin;
  }

  async isAdminByUid(uid: string) {
    const user = await this.getUserByUid(uid);
    return this.isAdmin(user);
  }

  async getRoleByUid(uid: string) {
    const user = await this.getUserByUid(uid);
    return this.getRole(user);
  }

  async setRole(uid: string, role: UserRole) {
    await this.app.auth.setCustomUserClaims(uid, { role });
    await this.userRef(uid).set({ role }, { merge: true });
  }

  async withAdmin<T>(auth: AuthData | undefined, cb: () => Promise<T>): Promise<WithAdminResponse<T>> {
    const failed = (reason: string): WithAdminResponse<T> => ({ status: 'failed', reason });
    if (auth) {
      if (await this.isAdminByUid(auth.uid)) {
        const result = await cb();
        return {
          status: 'success',
          result,
        };
      } else {
        return failed('not an admin');
      }
    } else {
      return failed('not signed in');
    }
  }
}
