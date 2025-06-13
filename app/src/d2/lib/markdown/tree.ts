import type { Literal, Node, Parent, Root } from 'mdast';
import { getDefinition } from '$d2/lib/definition/app.svelte';
import type { MarkdownElementModel } from '$d2/lib/markdown/element.svelte';
import { parse } from './parser';

type Element = Node & { tagName: string; properties: Record<string, string> };

export type MarkdownNode = MarkdownRoot | MarkdownElement | MarkdownText;

export type MarkdownParent = {
  children: MarkdownNode[];
};

export type MarkdownRoot = MarkdownParent & {
  type: 'root';
  models: MarkdownElementModel[];
};

export type MarkdownElement = MarkdownParent & {
  type: 'element';
  name: string;
  attributes: Record<string, string>;
  model: MarkdownElementModel | undefined;
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
  const definition = getDefinition();
  const models: MarkdownElementModel[] = [];
  const normalizeNode = (node: Node): MarkdownNode => {
    if (node.type === 'text') {
      const value = (node as Literal).value;
      return {
        type: 'text',
        value,
      };
    } else {
      const element = node as Element;
      const name = element.tagName.toLowerCase();
      const normalized: MarkdownElement = {
        type: 'element',
        name,
        attributes: element.properties,
        model: undefined,
        children: normalizeChildren(element),
      };
      const model = definition.markdownElementByType(name)?.model({ node: normalized });
      if (model) {
        models.push(model);
        normalized.model = model;
      }
      return normalized;
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
    models,
  };
};

export const toTree = async (string: string | undefined) => {
  return normalized(await parse(string));
};
