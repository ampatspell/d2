import { FileNodeProperties } from './file';
import { MissingNodeProperties } from './missing';

export type NodePropertiesRegistry = {
  missing: MissingNodeProperties;
  file: FileNodeProperties;
};
