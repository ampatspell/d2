import { beforeNavigate } from '$app/navigation';
import type { BeforeNavigate } from '@sveltejs/kit';
import { Modal, type OpenModalOptions } from './modal.svelte';
import { Model } from '$d2/lib/base/model/model.svelte';
import { options, type OptionsInput } from '$d2/lib/base/utils/options';
import { lastObject, removeObject } from '$d2/lib/base/utils/array';
import { serialized } from '$d2/lib/base/utils/object';
import { createContext } from '$d2/lib/base/utils/context';

export type ModalsContextOptions = Record<string, never>;

export class ModalsContext extends Model<ModalsContextOptions> {
  constructor(opts: OptionsInput<ModalsContextOptions>) {
    super(opts);
    beforeNavigate((navigation: BeforeNavigate) => this.onBeforeNavigate(navigation));
  }

  modals = $state<Modal[]>([]);

  readonly last = $derived(lastObject(this.modals));

  async open<C>(opts: OptionsInput<OpenModalOptions<C>>) {
    const modal = new Modal<C>({
      context: this,
      open: options(opts),
    });
    this.modals.push(modal);
    return await modal.promise;
  }

  close(modal: Modal) {
    removeObject(this.modals, modal);
  }

  onBeforeNavigate(navigation: BeforeNavigate) {
    this.modals.forEach((modal) => {
      modal.onBeforeNavigate(navigation);
    });
  }

  readonly serialized = $derived(serialized(this, ['modals']));
}

const { get, set } = createContext<ModalsContext>('modals');

const createModalsContext = () => set(new ModalsContext({}));

export { createModalsContext, get as getModalsContext };
