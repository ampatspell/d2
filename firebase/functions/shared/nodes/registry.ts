import type { BaseNodeData } from "../documents";
import type { FileNodeProperties } from "./file";

export type FunctionsNodePropertiesRegistry = {
  file: FileNodeProperties;
};

export type FunctionsNodeType = keyof FunctionsNodePropertiesRegistry;

export type FunctionsNodeData<Type extends FunctionsNodeType = FunctionsNodeType> = BaseNodeData<Type, FunctionsNodePropertiesRegistry>;
