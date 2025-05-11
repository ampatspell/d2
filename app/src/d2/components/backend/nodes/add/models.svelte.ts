import type { ModalsContext } from '$d2/components/dark/modals/base/context.svelte';
import type { OptionsInput } from '$d2/lib/base/utils/options';
import type { NodeDefinitionModel } from '$d2/lib/definition/node.svelte';
import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
import Component from './component.svelte';

export type SelectNodeModalProps = {
  parent: NodeDocumentModel | undefined;
};

export type SelectNodeModalResolution = {
  parent: NodeDocumentModel | undefined;
  definition: NodeDefinitionModel;
};

export const openSelectNodeModal = (modals: ModalsContext, props: OptionsInput<SelectNodeModalProps>) => {
  return modals.open({
    component: Component,
    props,
  });
};
