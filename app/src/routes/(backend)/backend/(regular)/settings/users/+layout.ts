import { preload } from '$d2/lib/base/model/preload.svelte.js';
import { UsersModel } from '$d2/lib/users/users.svelte';

export const load = async () => {
  return {
    users: await preload(new UsersModel(undefined)),
  };
};
