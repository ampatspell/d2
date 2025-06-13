import { parse } from '$d2/lib/markdown/tree';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const input = `
# Hello\n\nworld

<box>this is in the **box** *box*</box>

a bit more afterwards

## And more

> hello

before [back](/) after
  `;
  return {
    input,
    root: await parse(input),
  };
};
