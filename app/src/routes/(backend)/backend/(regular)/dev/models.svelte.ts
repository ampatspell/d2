import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Root } from "mdast";

function compiler() {
  //@ts-expect-error todo compiler
  this.Compiler = (root) => root;
}

const pipe = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(compiler)
  .freeze();

const toTree = async (string: string | undefined) => {
  if(!string || typeof string !== 'string') {
    return undefined;
  }
  const vfile = await pipe.process(string);
  const root = vfile.result;
  return root;
}

export const toContent = async (string: string | undefined) => {
  return await toTree(string) as Root;
}
