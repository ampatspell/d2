export type MissingNodeProperties = {
  message?: string;
};

export type FileNodeProperties = undefined;

export type NodePropertiesRegistry = {
  missing: MissingNodeProperties;
  file: FileNodeProperties;
};
