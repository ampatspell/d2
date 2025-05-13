import { preloadModel } from '$d2/lib/base/fire/preload.svelte.js';
import { UsersUserModel } from '$d2/lib/users/users.svelte.js';

export const load = async (event) => {
  const id = event.params.id;
  return {
    user: await preloadModel(UsersUserModel.forId(id)),
  };
};
