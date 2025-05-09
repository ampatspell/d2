export type MissingNodeProperties = {
  message?: string;
};

export type FileNodeProperties = {
  file: {
    original: {
      contentType: string;
      size: number;
      filename: string;
      url: string;
    };
  };
};

export type NodePropertiesRegistry = {
  missing: MissingNodeProperties;
  file: FileNodeProperties;
};
