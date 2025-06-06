import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getSession } from '$d2/lib/session/session.svelte';

export const load: PageLoad = async (event) => {
  const next = event.url.searchParams.get('next') || '/backend';
  const session = getSession();
  if (session.user) {
    return redirect(307, next);
  }
  return {
    next,
  };
};
