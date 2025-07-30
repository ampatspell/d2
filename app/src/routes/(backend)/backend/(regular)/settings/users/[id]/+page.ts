import { preload } from '$d2/lib/base/refactoring/preload.svelte.js';
import { UsersUserModel } from '$d2/lib/users/users.svelte.js';

export const load = async (event) => {
  const id = event.params.id;
  return {
    user: await preload(UsersUserModel.forId(id)),
  };
};
