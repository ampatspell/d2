import { browser } from '$app/environment';
import {
  type DocumentData,
  type DocumentReference,
  type DocumentSnapshot,
  FieldValue,
  Timestamp,
  deleteDoc,
  deleteField,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  onSnapshot,
  setDoc,
} from '@firebase/firestore';
import { untrack } from 'svelte';
import { FirebaseModel, type FirebaseModelOptions } from './model.svelte';
import deepEqual from 'fast-deep-equal';
import type { OptionsInput } from '../../utils/options';
import type { VoidCallback } from '../../utils/types';
import { serialized } from '../../utils/object';

const createToken = () => {
  if (browser) {
    return window.crypto.randomUUID().replaceAll('-', '');
  }
  return null;
};

export const TOKEN = '_token';

export type DocumentLoadSource = 'cached' | 'remote';

const getDocBySource = async (ref: DocumentReference, source: DocumentLoadSource | undefined = 'cached') => {
  if (!browser) {
    source = undefined;
  }
  if (source === 'cached') {
    const cached = await getDocFromCache(ref);
    if (!cached.exists) {
      return getDocFromServer(ref);
    }
    return cached;
  } else if (source === 'remote') {
    return getDocFromServer(ref);
  } else if (source === undefined) {
    return getDoc(ref);
  }
  throw new Error(`unsupported source ${source}`);
};

export type DocumentLoadOptions = {
  force?: boolean;
  source?: DocumentLoadSource;
};

export type DocumentOptions<T> = {
  /**
   * Defaults to false
   */
  ref?: DocumentReference;
  /**
   * Optional initial data
   */
  data?: T;
  /**
   * Defaults to true
   */
  isNew?: boolean;
} & FirebaseModelOptions;

export const toData = (input: unknown): unknown => {
  if (Array.isArray(input)) {
    return input.map((entry) => toData(entry));
  } else if (input instanceof Timestamp) {
    return input.toDate();
  } else if (input instanceof Date) {
    return input;
  } else if (input instanceof FieldValue) {
    return input;
  } else if (input === null) {
    return null;
  } else if (input === undefined) {
    return deleteField();
  } else if (typeof input === 'object') {
    const out: Record<string, unknown> = {};
    for (const key in input) {
      const value = (input as DocumentData)[key] as DocumentData;
      out[key] = toData(value);
    }
    return out;
  } else {
    return input;
  }
};

export class Document<T extends DocumentData = DocumentData> extends FirebaseModel<DocumentOptions<T>> {
  readonly token: string | null;

  constructor(options: OptionsInput<DocumentOptions<T>>) {
    super(options);
    this.token = createToken();
    this._isNew = this.options.isNew ?? true;
    const data = this.options.data;
    if (data) {
      this._data = data;
    }
  }

  private _data = $state<T>();
  private _exists = $state<boolean>();
  private _isNew = $state<boolean>()!; // TODO: this is not updated on snapshot and on save
  private _isSaving = $state(false);
  private _isDeleting = $state(false);

  get data() {
    return this._subscribe(() => this._data);
  }

  get exists() {
    return this._subscribe(() => this._exists);
  }

  get isNew() {
    return this._subscribe(() => this._isNew);
  }

  get isSaving() {
    return this._subscribe(() => this._isSaving);
  }

  get isDeleting() {
    return this._subscribe(() => this._isDeleting);
  }

  readonly ref = $derived(this.options.ref);
  readonly id = $derived(this.ref?.id);
  readonly path = $derived(this.ref?.path);

  _subscribeActive() {
    $effect(() => {
      const ref = this.ref;
      untrack(() => this._onWillLoad(!!ref));
      let cancel: VoidCallback;
      if (ref) {
        const snapshot = onSnapshot(
          ref,
          { includeMetadataChanges: true },
          (snapshot) => {
            this._onSnapshot(snapshot);
          },
          (error) => {
            this._onError(error);
          },
        );
        const listening = this._registerListening(this);
        cancel = () => {
          snapshot();
          listening();
        };
      }
      return () => {
        cancel?.();
      };
    });
  }

  _onSnapshot(snapshot: DocumentSnapshot) {
    const exists = snapshot.exists();
    const next = snapshot.data({ serverTimestamps: 'estimate' }) as T | undefined;
    if (next && next[TOKEN] !== this.token) {
      const cast = toData(next) as T;
      if (!deepEqual($state.snapshot(this._data), cast)) {
        this._data = cast;
      }
    }
    this._exists = exists;
    this._onDidLoad(snapshot.metadata);
  }

  async load(options: DocumentLoadOptions = {}) {
    if (this.isLoaded && !options.force) {
      return;
    }
    const ref = this.ref;
    if (!ref) {
      return;
    }
    await this._onLoad(async () => {
      const snapshot = await getDocBySource(ref, options.source);
      this._onSnapshot(snapshot);
    });
  }

  async save(): Promise<void> {
    const ref = this.ref;
    if (ref) {
      const data = Object.assign({}, toData($state.snapshot(this._data)), { [TOKEN]: this.token });
      // TODO: queue
      this._isSaving = true;
      try {
        await setDoc(ref, data, { merge: true });
      } catch (err) {
        this._onError(err);
      } finally {
        this._isSaving = false;
      }
    }
  }

  async delete(): Promise<void> {
    const ref = this.ref;
    if (ref) {
      try {
        this._isDeleting = true;
        await deleteDoc(ref);
        this._exists = false;
      } catch (err) {
        this._onError(err);
      } finally {
        this._isSaving = false;
        this._isDeleting = false;
      }
    }
  }

  serialized = $derived(serialized(this, ['path', 'isLoading', 'isLoaded', 'error']));
}
