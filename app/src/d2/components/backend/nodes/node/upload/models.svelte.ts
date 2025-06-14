import type { ModalsContext } from '$d2/components/dark/modals/base/context.svelte';
import type { OptionsInput } from '$d2/lib/base/utils/options';
import type { NodeModel } from '$d2/lib/nodes/node/node.svelte';
import Component from './component.svelte';

export type UploadFilesModalProps = {
  node: NodeModel;
};

export type UploadFilesModalResolution = boolean;

export const openUploadFilesModal = (modals: ModalsContext, props: OptionsInput<UploadFilesModalProps>) => {
  return modals.open({
    component: Component,
    props,
  });
};
