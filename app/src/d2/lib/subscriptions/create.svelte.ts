import {
  type FunctionsCreateSubscriptionRequest,
  type FunctionsCreateSubscriptionResponse,
} from '$d2-shared/functions';
import { httpsCallable } from '@firebase/functions';
import { firebase } from '../base/fire/firebase.svelte';
import { serialized } from '../base/utils/object';
import { Model } from '../base/model/base.svelte';

export type CreateSubscriptionModelOptions = {
  kind: string;
};

export class CreateSubscriptionModel extends Model<CreateSubscriptionModelOptions> {
  readonly kind = $derived(this.options.kind);

  email = $state('');
  fullName = $state<string>();

  isBusy = $state(false);

  readonly isValid = $derived(!!this.email);

  private response = $state<FunctionsCreateSubscriptionResponse>();
  readonly isSuccess = $derived(this.response?.status === 'success');
  readonly reason = $derived.by(() => {
    const response = this.response;
    if (response?.status === 'failed') {
      return response.reason;
    }
  });

  async save() {
    if (!this.isValid || this.isBusy) {
      return;
    }
    try {
      this.isBusy = true;
      const callable = httpsCallable<FunctionsCreateSubscriptionRequest, FunctionsCreateSubscriptionResponse>(
        firebase.functions,
        'createSubscription',
      );
      const { kind, email, fullName } = this;
      const response = await callable({
        kind,
        email,
        fullName,
      });
      this.response = response.data;
    } finally {
      this.isBusy = false;
    }
  }

  readonly serialized = $derived(
    serialized(this, ['kind', 'email', 'fullName', 'isValid', 'isBusy', 'isSuccess', 'reason']),
  );
}
