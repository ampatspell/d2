import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type { Node, Root } from 'mdast';
import { createContext } from '$d2/lib/base/utils/context';
import { options, type OptionsInput } from '$d2/lib/base/utils/options';
import { Model } from '$d2/lib/base/model/model.svelte';
import type { Component } from 'svelte';

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

export const toTree = async (string: string | undefined) => {
  const vfile = await pipe.process(string ?? '');
  const root = vfile.result as Root;
  return root;
};

export const elements = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'pre', 'code', 'blockquote'];

export type Element = Node & { tagName: string; properties: Record<string, string> };

export type MarkdownDelegate = {
  componentForElement: (element: Element) => Component<{ node: Element }> | undefined;
};

export type MarkdownContextOptions = {
  delegate: MarkdownDelegate;
};

export class MarkdownContext extends Model<MarkdownContextOptions> {
  componentForElement(element: Element) {
    return this.options.delegate.componentForElement(element);
  }
}

const { get: getMarkdownContext, set: setMarkdownContext } = createContext<MarkdownContext>('markdown');

const createMarkdownContext = (opts: OptionsInput<MarkdownDelegate>) => {
  const context = new MarkdownContext({
    delegate: options(opts),
  });
  return setMarkdownContext(context);
};

export { getMarkdownContext, createMarkdownContext };
