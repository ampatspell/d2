import type { ModalsContext } from '$d2/components/dark/modals/base/context.svelte';
import type { Placement } from '$d2/components/dark/modals/base/placement/placement.svelte';
import { type OptionsInput } from '$d2/lib/base/utils/options';
import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
import type { NodesModel } from '$d2/lib/nodes/nodes.svelte';
import Component from './component.svelte';

export type SelectNodeModalProps = {
  title: string;
  nodes: NodesModel;
};

export type SelectNodeModalResolution = {
  node: NodeDocumentModel;
};

export const openSelectNodeModal = (
  modals: ModalsContext,
  props: OptionsInput<SelectNodeModalProps>,
  placement?: Placement,
) => {
  return modals.open({
    placement,
    component: Component,
    props,
  });
};
