import type { ModalsContext } from '$d2/components/dark/modals/base/context.svelte';
import type { OptionsInput } from '$d2/lib/base/utils/options';
import type { NodeDocumentModel } from '$d2/lib/nodes/node.svelte';
import Component from './component.svelte';

export type UploadFilesModalProps = {
  node: NodeDocumentModel;
};

export type UploadFilesModalResolution = boolean;

export const openUploadFilesModal = (modals: ModalsContext, props: OptionsInput<UploadFilesModalProps>) => {
  return modals.open({
    component: Component,
    props,
  });
};
