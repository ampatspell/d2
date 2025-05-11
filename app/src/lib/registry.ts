import type { FunctionsNodePropertiesRegistry } from '$d2-shared/nodes/registry';
import type { IndexNodeProperties } from './index/definition.svelte';

export type NodePropertiesRegistry = FunctionsNodePropertiesRegistry & {
  index: IndexNodeProperties;
};
