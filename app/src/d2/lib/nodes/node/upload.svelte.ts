import * as fs from '@firebase/firestore';
import * as storage from 'firebase/storage';
import pLimit, { type LimitFunction } from 'p-limit';
import type { NodeModel } from './node.svelte';
import { progress, sum } from '$d2/lib/base/utils/number';
import { nextPosition, nodesCollection } from '../nodes.svelte';
import { firebase } from '$d2/lib/base/fire/firebase.svelte';
import { Subscribable } from '$d2/lib/base/model/model.svelte';
import { removeObject } from '$d2/lib/base/utils/array';

export type UploadFileStatus = 'idle' | 'uploading' | 'uploaded' | 'error';

export type UploadFileModelOptions = {
  upload: UploadFilesModel;
  file: File;
};

export class UploadFileModel {
  constructor(private options: UploadFileModelOptions) {
    this.total = this.data.size;
  }

  status = $state<UploadFileStatus>('idle');
  readonly name = $derived.by(() => this.options.file.name);

  total = $state(0);
  transferred = $state(0);

  readonly progress = $derived.by(() => progress(this.total, this.transferred));
  readonly data = $derived.by(() => this.options.file);
  readonly contentType = $derived.by(() => this.data.type);
  readonly size = $derived.by(() => this.data.size);
  readonly id = $derived.by(() => fs.doc(nodesCollection).path);
  readonly path = $derived.by(() => `${this.id}/original`);
  readonly ref = $derived.by(() => storage.ref(firebase.storage, this.path));
  readonly position = $derived.by(() => this.options.upload.positionFor(this));

  remove() {
    if (this.status === 'idle') {
      removeObject(this.options.upload.files, this);
    }
  }

  async _onUpload() {
    const { ref, data, contentType } = this;

    const task = storage.uploadBytesResumable(ref, data, {
      contentType,
      cacheControl: 'public, max-age=31536000',
      customMetadata: {
        filename: this.name,
        parent: this.options.upload.id,
        position: String(this.position),
      },
    });

    const next = (snapshot: storage.UploadTaskSnapshot) => {
      this.total = snapshot.totalBytes;
      this.transferred = snapshot.bytesTransferred;
    };

    const error = (err: storage.StorageError) => {
      console.log(err);
      this.status = 'error';
    };

    const complete = () => {
      this.status = 'uploaded';
      cancel();
    };

    const cancel = task.on('state_changed', next, error, complete);

    await task;
  }

  async onUpload(limit: LimitFunction) {
    if (this.status === 'uploading') {
      return;
    }
    this.status = 'uploading';
    await limit(() => this._onUpload());
  }
}

export type UploadFilesModelOptions = {
  node: NodeModel;
};

export class UploadFilesModel extends Subscribable<UploadFilesModelOptions> {
  files = $state<UploadFileModel[]>([]);
  readonly primitive = $derived(this.files.map((model) => model.data));

  onFiles(files: File[]) {
    this.files = files.map((file) => new UploadFileModel({ file, upload: this }));
  }

  readonly isBusy = $derived.by(() => {
    return !!this.files.find((file) => file.status === 'uploading');
  });

  readonly total = $derived.by(() => sum(this.files, (file) => file.total));
  readonly transferred = $derived.by(() => sum(this.files, (file) => file.transferred));
  readonly progress = $derived.by(() => progress(this.total, this.transferred));

  readonly node = $derived(this.options.node);
  readonly id = $derived(this.node.id);
  readonly path = $derived(this.node.path.value);
  readonly position = $derived(nextPosition(this.node.backend?.children ?? []));

  positionFor(file: UploadFileModel) {
    return this.position + this.files.indexOf(file);
  }

  async onUpload() {
    if (this.isBusy) {
      return;
    }

    const limit = pLimit(25);

    await Promise.all(this.files.map((file) => file.onUpload(limit)));
  }

  readonly dependencies = [];
}
