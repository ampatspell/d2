export type MissingNodeProperties = {
  message?: string;
};

export const fileThumbnails = ['100x100', '400x400', '1024x1024', '2048x2048'] as const;

export type FileThumbnails = (typeof fileThumbnails)[number];

export type Dimensions = { width: number; height: number };

export type FileProperty = {
  filename: string;
  contentType: string;
  dimensions: Dimensions;
  size: number;
  url: string;
};

export type FileNodeProperties = {
  original: FileProperty;
  thumbnails: { [key in FileThumbnails]: FileProperty };
};

export type NodePropertiesRegistry = {
  missing: MissingNodeProperties;
  file: FileNodeProperties;
};
