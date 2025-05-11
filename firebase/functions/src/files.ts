import { getDownloadURL } from 'firebase-admin/storage';
import { File } from '@google-cloud/storage';
import Application from './app';
import sharp from 'sharp';
import { Dimensions, FileThumbnail, fileThumbnails } from '../shared/nodes/file';

export type FileData = {
  name: string;
  contentType?: string;
  size: number;
  metadata?: Record<string, string>;
};

export type ProcessFileRequest = {
  name: string;
  contentType: string;
  nameForThumbnail: (id: FileThumbnail) => string;
};

export type ProcessImageResponseEntry = {
  name: string;
  contentType: string;
  size: number;
  dimensions: Dimensions;
  url: string;
};

export type ProcessFileResponse = ProcessImageResponse | ProcessRegularResponse;

export type ProcessRegularResponse = {
  type: 'regular';
  original: {
    name: string;
    contentType: string;
    size: number;
    url: string;
  };
};

export type ProcessImageResponse = {
  type: 'image';
  original: ProcessImageResponseEntry;
  thumbnails: { [key in FileThumbnail]: ProcessImageResponseEntry };
};

const imageContentTypes = ['image/jpeg', 'image/png', 'image/gif'];

export class FilesService {
  constructor(private readonly app: Application) {}

  async onStorageObjectFinalized(data: FileData) {
    await this.app.nodes.files.onStorageObjectFinalized(data);
  }

  private isImage(contentType: string) {
    return imageContentTypes.includes(contentType);
  }

  private async createThumbnails(request: ProcessFileRequest, original: Buffer) {
    const array = await Promise.all(
      (Object.keys(fileThumbnails) as FileThumbnail[]).map(async (id) => {
        const definition = fileThumbnails[id];

        const { data, info } = await sharp(original)
          .resize({
            width: definition.width,
            height: definition.height,
            fit: definition.fit,
            withoutEnlargement: true,
          })
          .jpeg({ quality: 80 })
          .toBuffer({ resolveWithObject: true });

        const dimensions = {
          width: info.width,
          height: info.height,
        };

        const size = info.size!;

        const contentType = 'image/jpeg';
        const name = request.nameForThumbnail(id);
        const file = this.app.bucket.file(name);

        await file.save(data, {
          resumable: false,
          contentType,
          public: true,
        });

        const url = await getDownloadURL(file);

        return {
          id,
          name,
          contentType,
          size,
          dimensions,
          url,
        };
      }),
    );

    return array.reduce((hash, { id, contentType, dimensions, name, size, url }) => {
      hash[id] = { name, contentType, size, dimensions, url };
      return hash;
    }, {}) as {
      [key in FileThumbnail]: ProcessImageResponseEntry;
    };
  }

  private async processOriginalImage(
    request: ProcessFileRequest,
    file: File,
    buffer: Buffer,
  ): Promise<ProcessImageResponseEntry> {
    const [url, metadata] = await Promise.all([getDownloadURL(file), sharp(buffer).metadata()]);
    const dimensions = {
      width: metadata.width!,
      height: metadata.height!,
    };
    const name = file.name;
    const contentType = request.contentType;
    const size = metadata.size!;
    return {
      name,
      contentType,
      size,
      dimensions,
      url,
    };
  }

  private async processImage(request: ProcessFileRequest): Promise<ProcessImageResponse> {
    const file = this.app.bucket.file(request.name);
    const [buffer] = await file.download();

    const [original, thumbnails] = await Promise.all([
      this.processOriginalImage(request, file, buffer),
      this.createThumbnails(request, buffer),
    ]);

    return {
      type: 'image',
      original,
      thumbnails,
    };
  }

  private async processRegular(request: ProcessFileRequest): Promise<ProcessRegularResponse> {
    const file = this.app.bucket.file(request.name);
    const [[metadata], url] = await Promise.all([file.getMetadata(), getDownloadURL(file)]);
    const toSize = (value: number | string | undefined) => {
      if (typeof value === 'string') {
        return parseInt(value);
      }
      return value ?? 0;
    };
    return {
      type: 'regular',
      original: {
        name: request.name,
        contentType: request.contentType,
        size: toSize(metadata.size),
        url,
      },
    };
  }

  async processFile(request: ProcessFileRequest): Promise<ProcessFileResponse> {
    if (this.isImage(request.contentType)) {
      return await this.processImage(request);
    } else {
      return await this.processRegular(request);
    }
  }
}
