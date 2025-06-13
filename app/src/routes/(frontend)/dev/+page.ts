import { toTree } from '$d2/lib/markdown/tree';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const input = `
# Hello\n\nworld

<weirdo label="hey there!">some inner text</weirdo>

a bit more afterwards

## And more

> hello

before [back](/) after
  `;
  return {
    input,
    root: await toTree(input),
  };
};
