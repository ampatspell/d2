import type { FunctionsNodePropertiesRegistry } from '$d2-shared/nodes/registry';
import type { BlankNodeProperties } from './blank/definition.svelte';

export type NodePropertiesRegistry = FunctionsNodePropertiesRegistry & {
  blank: BlankNodeProperties;
};
