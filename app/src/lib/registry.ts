import type { FunctionsNodePropertiesRegistry } from '$d2-shared/nodes/registry';
import type { MissingNodeProperties } from './missing/definition.svelte';

export type NodePropertiesRegistry = FunctionsNodePropertiesRegistry & {
  missing: MissingNodeProperties;
};
