import { preloadModel } from '$d2/lib/base/fire/preload.svelte';
import { UsersModel } from '$d2/lib/users/users.svelte';

export const load = async (event) => {
  return {
    id: event.params.id,
    users: await preloadModel(new UsersModel(undefined)),
  };
};
