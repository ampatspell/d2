import * as fs from '@firebase/firestore';
import * as storage from 'firebase/storage';
import pLimit, { type LimitFunction } from 'p-limit';
import { progress, sum } from '../base/utils/number';
import { firebase } from '../base/fire/firebase.svelte';
import { removeObject } from '../base/utils/array';
import { Subscribable } from '../base/model/model.svelte';
import type { NodeDocumentModel } from './node.svelte';

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

  readonly id = $derived.by(() => fs.doc(fs.doc(firebase.firestore, this.options.upload.path).parent));
  readonly path = $derived.by(() => `${this.options.upload.path}/${this.id}`);
  readonly ref = $derived.by(() => storage.ref(firebase.storage, this.path));

  remove() {
    if (this.status === 'idle') {
      removeObject(this.options.upload.files, this);
    }
  }

  async _onUpload() {
    const { ref, data, contentType } = this;

    const task = storage.uploadBytesResumable(ref, data, {
      contentType,
      customMetadata: {
        filename: this.name,
        node: this.options.upload.id,
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
  node: NodeDocumentModel;
};

export class UploadFilesModel extends Subscribable<UploadFilesModelOptions> {
  files = $state<UploadFileModel[]>([]);
  readonly primitive = $derived.by(() => this.files.map((model) => model.data));

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
  readonly path = $derived(this.node.path);

  async onUpload() {
    if (this.isBusy) {
      return;
    }

    const limit = pLimit(25);

    await Promise.all(this.files.map((file) => file.onUpload(limit)));
  }
}
