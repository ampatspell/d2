import { FieldValue } from 'firebase-admin/firestore';
import Application from './app';
import { SubscriptionData } from '../shared/documents';
import { converter } from './utils/firestore';
import { FunctionsCreateSubscriptionRequest, FunctionsCreateSubscriptionResponse } from '../shared/functions';

export class SubscriptionsService {
  constructor(private readonly app: Application) {}

  private get subscriptionsCollection() {
    return this.app.firestore.collection('subscriptions');
  }

  private async loadSubscriptionByEmail(email: string) {
    return await this.subscriptionsCollection.doc(email).withConverter(converter<SubscriptionData>()).get();
  }

  async createSubscription(opts: FunctionsCreateSubscriptionRequest): Promise<FunctionsCreateSubscriptionResponse> {
    const error = (reason: string): FunctionsCreateSubscriptionResponse => ({ status: 'failed', reason });
    if (!opts) {
      return error('no data');
    }

    let { email, kind, fullName } = opts;

    // TODO: zod
    {
      if (typeof email !== 'string') {
        return error('email is required');
      }
      email = email.trim();
      if (!email) {
        return error('email is required');
      }
    }
    {
      if (typeof kind !== 'string') {
        return error('kind is required');
      }
      kind = kind.trim();
      if (!kind) {
        return error('kind is required');
      }
    }
    {
      if (typeof fullName === 'string') {
        fullName = fullName.trim();
      } else {
        fullName = undefined;
      }
    }

    return await this.app.firestore.runTransaction(async () => {
      const snapshot = await this.loadSubscriptionByEmail(email);
      const data = snapshot.data();
      if (data) {
        if (data.kinds.includes(kind)) {
          return {
            status: 'failed',
            reason: 'exists',
          };
        } else {
          await snapshot.ref.set(
            {
              kinds: FieldValue.arrayUnion(kind),
            },
            { merge: true },
          );
          return {
            status: 'success',
          };
        }
      } else {
        await snapshot.ref.set(
          {
            kinds: [kind],
            email,
            isEmailVerified: false,
            fullName: fullName ?? null,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
        return {
          status: 'success',
        };
      }
    });
  }
}
