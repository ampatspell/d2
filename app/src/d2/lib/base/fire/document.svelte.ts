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
import { fireStats } from './stats.svelte';
import type { OptionsInput } from '../utils/options';
import type { VoidCallback } from '../utils/types';
import { serialized } from '../utils/object';
import deepEqual from 'fast-deep-equal';

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
    if(!cached.exists) {
      return getDocFromServer(ref);
    }
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
    this.isNew = this.options.isNew ?? true;
    const data = this.options.data;
    if (data) {
      this.data = data;
    }
  }

  data = $state<T>();
  exists = $state<boolean>();
  isNew = $state<boolean>()!; // TODO: this is not updated on snapshot and on save
  isSaving = $state(false);
  isDeleting = $state(false);

  ref = $derived(this.options.ref);
  id = $derived(this.ref?.id);
  path = $derived(this.ref?.path);

  _subscribeActive() {
    return $effect.root(() => {
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
          const listening = fireStats._registerListening(this);
          cancel = () => {
            snapshot();
            listening();
          };
        }

        return () => {
          cancel?.();
        };
      });
    });
  }

  _onSnapshot(snapshot: DocumentSnapshot) {
    const exists = snapshot.exists();
    const next = snapshot.data({ serverTimestamps: 'estimate' }) as T | undefined;
    if (next && next[TOKEN] !== this.token) {
      const cast = toData(next) as T;
      if (!deepEqual($state.snapshot(this.data), cast)) {
        this.data = cast;
      }
    }
    this.exists = exists;
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
    this.isLoading = true;
    try {
      const snapshot = await getDocBySource(ref, options.source);
      this._onSnapshot(snapshot);
    } catch (err) {
      this._onError(err);
    } finally {
      this.isLoading = false;
    }
  }

  async save(): Promise<void> {
    const ref = this.ref;
    if (ref) {
      const data = Object.assign({}, toData($state.snapshot(this.data)), { [TOKEN]: this.token });
      // TODO: queue
      this.isSaving = true;
      try {
        await setDoc(ref, data, { merge: true });
      } catch (err) {
        this._onError(err);
      } finally {
        this.isSaving = false;
      }
    }
  }

  async delete(): Promise<void> {
    const ref = this.ref;
    if (ref) {
      try {
        this.isDeleting = true;
        await deleteDoc(ref);
        this.exists = false;
      } catch (err) {
        this._onError(err);
      } finally {
        this.isSaving = false;
        this.isDeleting = false;
      }
    }
  }

  serialized = $derived(serialized(this, ['path', 'isLoading', 'isLoaded', 'error', 'isSubscribed']));
}
