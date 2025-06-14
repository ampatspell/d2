import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type { Root } from 'mdast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function compiler(this: any) {
  this.Compiler = (root: Root) => root;
}

const pipe = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(compiler)
  .freeze();

export const parse = async (string: string | undefined) => {
  const vfile = await pipe.process(string ?? '');
  const root = vfile.result as Root;
  return root;
};
