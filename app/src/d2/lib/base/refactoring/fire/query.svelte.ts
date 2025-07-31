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
import { FirebaseModel, type FirebaseModelOptions } from './model.svelte';
import { browser } from '$app/environment';
import type { VoidCallback } from '../../utils/types';
import { insertObjectAt, removeObjectAt } from '../../utils/array';
import { serialized } from '../../utils/object';
import { fireStats } from './stats.svelte';

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
    if (cached.empty) {
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
  readonly ref = $derived(this.options.ref);

  readonly path = $derived.by(() => {
    const { ref } = this;
    if (ref) {
      const path = (ref as unknown as { path: string | undefined }).path;
      return path;
    }
  });

  private _needsContentReset = false;
  private __content = $state<Document<T>[]>([]);

  protected get _content() {
    return this._subscribe(() => this.__content);
  }

  protected _onWillLoad(subscribe: boolean) {
    super._onWillLoad(subscribe);
    if (subscribe) {
      this._needsContentReset = true;
    } else {
      this.__content = [];
    }
  }

  private _maybeResetContent() {
    const content = this.__content;
    if (this._needsContentReset) {
      this.__content = [];
      this._needsContentReset = false;
    }
    return content;
  }

  protected _subscribeActive() {
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
  }

  protected _normalizeRef(ref: Query) {
    return ref;
  }

  private _onSnapshot(querySnapshot: QuerySnapshot) {
    const previous = this._maybeResetContent();
    const findOrCreate = (snapshot: QueryDocumentSnapshot) => {
      let doc = previous.find((doc) => doc.path === snapshot.ref.path);
      if (!doc) {
        doc = new Document<T>({ ref: snapshot.ref, isNew: false, isPassive: true });
      }
      return doc;
    };

    const current = this.__content;

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
    await this._onLoad(async () => {
      const normalized = this._normalizeRef(ref);
      const snapshot = await getDocsBySource(normalized, options.source);
      this._needsContentReset = true;
      this._onSnapshot(snapshot);
    });
  }
}

export type QueryAllOptions = QueryBaseOptions;

export class QueryAll<T extends DocumentData = DocumentData> extends QueryBase<T, QueryAllOptions> {
  readonly content = $derived(this._content);
  readonly size = $derived(this.content.length);

  readonly serialized = $derived.by(() => {
    return serialized(this, ['path', 'isLoading', 'isLoaded', 'isError', 'error', 'size']);
  });
}

export type QueryFirstOptions = QueryBaseOptions;

export class QueryFirst<T extends DocumentData = DocumentData> extends QueryBase<T, QueryFirstOptions> {
  readonly content = $derived<Document<T> | undefined>(this._content[0]);

  readonly exists = $derived.by(() => {
    if (this.isLoaded) {
      return !!this.content;
    }
  });

  protected _normalizeRef(ref: Query) {
    return query(ref, limit(1));
  }

  readonly serialized = $derived.by(() => {
    return serialized(this, ['path', 'isLoading', 'isLoaded', 'isError', 'error', 'exists']);
  });
}

export const queryAll = <T extends DocumentData = DocumentData>(...args: ConstructorParameters<typeof QueryAll<T>>) => {
  return new QueryAll<T>(...args);
};

export const queryFirst = <T extends DocumentData = DocumentData>(
  ...args: ConstructorParameters<typeof QueryFirst<T>>
) => {
  return new QueryFirst<T>(...args);
};
