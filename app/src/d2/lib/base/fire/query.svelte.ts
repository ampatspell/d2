import {
  type DocumentData,
  type Query,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  limit,
  onSnapshot,
  query,
} from '@firebase/firestore';
import { untrack } from 'svelte';

import { Document, type DocumentLoadSource } from './document.svelte';
import { fireStats } from './stats.svelte';
import { FirebaseModel, type FirebaseModelOptions } from './model.svelte';
import type { VoidCallback } from '../utils/types';
import { insertObjectAt, removeObjectAt } from '../utils/array';
import { serialized } from '../utils/object';
import { browser } from '$app/environment';

export type DocumentsLoadOptions = {
  source?: DocumentLoadSource;
  force?: boolean;
};

const getDocsBySource = async (ref: Query, source: DocumentLoadSource | undefined = 'cached') => {
  if (!browser) {
    source = undefined;
  }
  if (source === 'cached') {
    const cached = await getDocsFromCache(ref);
    if(cached.empty) {
      return getDocsFromServer(ref);
    }
    return cached;
  } else if (source === 'remote') {
    return getDocsFromServer(ref);
  } else if (source === undefined) {
    return getDocs(ref);
  }
  throw new Error(`unsupported source ${source}`);
};

export type QueryBaseOptions = {
  ref: Query | undefined;
} & FirebaseModelOptions;

export class QueryBase<
  T extends DocumentData = DocumentData,
  O extends QueryBaseOptions = QueryBaseOptions,
> extends FirebaseModel<O> {
  ref = $derived(this.options.ref);

  path = $derived.by(() => {
    const { ref } = this;
    if (ref) {
      const path = (ref as unknown as { path: string | undefined }).path;
      return path;
    }
  });

  private needsContentReset = false;
  _content = $state<Document<T>[]>([]);

  _onWillLoad(subscribe: boolean) {
    super._onWillLoad(subscribe);
    if (subscribe) {
      this.needsContentReset = true;
    } else {
      this._content = [];
    }
  }

  _maybeResetContent() {
    const content = this._content;
    if (this.needsContentReset) {
      this._content = [];
      this.needsContentReset = false;
    }
    return content;
  }

  _subscribeActive() {
    return $effect.root(() => {
      $effect(() => {
        const ref = this.ref;

        untrack(() => this._onWillLoad(!!ref));

        let cancel: VoidCallback;
        if (ref) {
          const normalized = this._normalizeRef(ref);
          const snapshot = onSnapshot(
            normalized,
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

  _normalizeRef(ref: Query) {
    return ref;
  }

  _onSnapshot(querySnapshot: QuerySnapshot) {
    const previous = this._maybeResetContent();
    const findOrCreate = (snapshot: QueryDocumentSnapshot) => {
      let doc = previous.find((doc) => doc.path === snapshot.ref.path);
      if (!doc) {
        doc = new Document<T>({ ref: snapshot.ref, isNew: false, isPassive: true });
      }
      return doc;
    };

    const current = this._content;

    querySnapshot.docChanges().forEach(({ type, oldIndex, newIndex, doc: snapshot }) => {
      if (type === 'added') {
        const doc = findOrCreate(snapshot);
        doc._onSnapshot(snapshot);
        insertObjectAt(current, newIndex, doc);
      } else if (type === 'modified') {
        const doc = current[oldIndex];
        doc._onSnapshot(snapshot);
        if (oldIndex !== newIndex) {
          removeObjectAt(current, oldIndex);
          insertObjectAt(current, newIndex, doc);
        }
      } else if (type === 'removed') {
        const doc = current[oldIndex];
        doc._onSnapshot(snapshot);
        removeObjectAt(current, oldIndex);
      }
    });

    this._onDidLoad(querySnapshot.metadata);
  }

  async load(options: DocumentsLoadOptions = {}) {
    if (this.isLoaded && !options.force) {
      return;
    }
    const ref = this.ref;
    if (!ref) {
      return;
    }
    this.isLoading = true;
    try {
      const normalized = this._normalizeRef(ref);
      const snapshot = await getDocsBySource(normalized, options.source);
      this.needsContentReset = true;
      this._onSnapshot(snapshot);
    } catch (err) {
      this._onError(err);
    } finally {
      this.isLoading = false;
    }
  }
}

export type QueryAllOptions = QueryBaseOptions;

export class QueryAll<T extends DocumentData = DocumentData> extends QueryBase<T, QueryAllOptions> {
  content = $derived(this._content);
  size = $derived(this.content.length);

  serialized = $derived(
    serialized(this, ['path', 'isLoading', 'isLoaded', 'isError', 'error', 'isSubscribed', 'size']),
  );
}

export type QueryFirstOptions = QueryBaseOptions;

export class QueryFirst<T extends DocumentData = DocumentData> extends QueryBase<T, QueryFirstOptions> {
  content = $derived<Document<T> | undefined>(this._content[0]);

  exists = $derived.by(() => {
    if (this.isLoaded) {
      return !!this.content;
    }
  });

  _normalizeRef(ref: Query) {
    return query(ref, limit(1));
  }

  serialized = $derived(
    serialized(this, ['path', 'isLoading', 'isLoaded', 'isError', 'error', 'isSubscribed', 'exists']),
  );
}

export const queryAll = <T extends DocumentData = DocumentData>(...args: ConstructorParameters<typeof QueryAll<T>>) => {
  return new QueryAll<T>(...args);
};

export const queryFirst = <T extends DocumentData = DocumentData>(
  ...args: ConstructorParameters<typeof QueryFirst<T>>
) => {
  return new QueryFirst<T>(...args);
};
