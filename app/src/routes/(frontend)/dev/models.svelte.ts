import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type { Literal, Node, Parent, Root } from 'mdast';
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

const toRoot = async (string: string | undefined) => {
  const vfile = await pipe.process(string ?? '');
  const root = vfile.result as Root;
  return root;
};

type Element = Node & { tagName: string; properties: Record<string, string> };

export type MarkdownNode = MarkdownRoot | MarkdownElement | MarkdownText;

export type MarkdownParent = {
  children: MarkdownNode[];
};

export type MarkdownRoot = MarkdownParent & {
  type: 'root';
};

export type MarkdownElement = MarkdownParent & {
  type: 'element';
  name: string;
  attributes: Record<string, string>;
};

export type MarkdownText = {
  type: 'text';
  value: string;
};

export const asParent = (node: MarkdownNode): MarkdownParent | undefined => {
  const parent = node as MarkdownParent;
  if (Array.isArray(parent.children)) {
    return parent;
  }
};

const normalized = (root: Root): MarkdownRoot => {
  const normalizeNode = (node: Node): MarkdownNode => {
    if (node.type === 'text') {
      const value = (node as Literal).value;
      return {
        type: 'text',
        value,
      };
    } else {
      const element = node as Element;
      return {
        type: 'element',
        name: element.tagName.toLowerCase(),
        attributes: element.properties,
        children: normalizeChildren(element),
      };
    }
  };
  const normalizeChildren = (node: Node): MarkdownNode[] => {
    const children = (node as Parent).children;
    return (children ?? []).map((node) => {
      return normalizeNode(node);
    });
  };
  return {
    type: 'root',
    children: normalizeChildren(root),
  };
};

export const toTree = async (string: string | undefined) => {
  return normalized(await toRoot(string));
};

export type MarkdownDelegate = {
  componentForElement: (element: MarkdownElement) => Component<{ node: MarkdownElement }> | undefined;
};

export type MarkdownContextOptions = {
  delegate: MarkdownDelegate;
};

const ELEMENTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'pre', 'code', 'blockquote'];

export class MarkdownContext extends Model<MarkdownContextOptions> {
  isBasicElement(node: MarkdownElement) {
    return ELEMENTS.includes(node.name);
  }

  componentForElement(element: MarkdownElement) {
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
