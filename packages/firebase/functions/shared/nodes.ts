export type MissingNodeProperties = {
  message?: string;
};

export type FileThumbnail = '100x100' | '400x400' | '1024x1024' | '2048x2048';

export type FileThumbnailDefinition = {
  width: number;
  height: number;
  fit: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
};

export const fileThumbnails: { [key in FileThumbnail]: FileThumbnailDefinition } = {
  '100x100': { width: 100, height: 100, fit: 'inside' },
  '400x400': { width: 400, height: 400, fit: 'inside' },
  '1024x1024': { width: 1024, height: 1024, fit: 'inside' },
  '2048x2048': { width: 2048, height: 2048, fit: 'inside' },
} as const;

export type FileThumbnails = keyof typeof fileThumbnails;

export type Dimensions = { width: number; height: number };

export type FileProperty = {
  contentType: string;
  size: number;
  url: string;
};

export type ImageFileProperty = FileProperty & {
  dimensions: Dimensions;
};

export type FileNodeProperties = {
  filename: string;
} & (
  | {
      type: 'regular';
      original: FileProperty;
    }
  | {
      type: 'image';
      original: ImageFileProperty;
      thumbnails: { [key in FileThumbnails]: ImageFileProperty };
    }
);

export type NodePropertiesRegistry = {
  missing: MissingNodeProperties;
  file: FileNodeProperties;
};
