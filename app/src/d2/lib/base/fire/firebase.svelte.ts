import { type FirebaseOptions, getApps, initializeApp } from 'firebase/app';
import { type Auth, browserLocalPersistence, initializeAuth } from 'firebase/auth';
import { type FirebaseStorage, getStorage } from 'firebase/storage';
import { type Functions, getFunctions } from 'firebase/functions';
import {
  type DocumentReference,
  type Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { browser } from '$app/environment';
import { serialized } from '../utils/object';
import { BaseModel } from '../model/base.svelte';
import { PUBLIC_FIREBASE, PUBLIC_FIREBASE_REGION } from '$env/static/public';
import { getAnalytics, type Analytics } from '@firebase/analytics';

export { type FirebaseOptions };

export class Firebase extends BaseModel {
  private options!: FirebaseOptions;
  private _region?: string;
  private _firestore?: Firestore;
  private _auth?: Auth;
  private _storage?: FirebaseStorage;
  private _functions?: Functions;
  private _analytics?: Analytics;

  readonly projectId = $derived(this.options.projectId);
  readonly region = $derived(this._region);

  constructor(options: FirebaseOptions, region?: string) {
    super();
    this.options = options;
    this._region = region;
  }

  get app() {
    let [app] = getApps();
    if (!app) {
      app = initializeApp(this.options);
    }
    return app;
  }

  get firestore() {
    if (!this._firestore) {
      this._firestore = initializeFirestore(this.app, {
        localCache: browser ? persistentLocalCache({ tabManager: persistentMultipleTabManager() }) : undefined,
      });
    }
    return this._firestore;
  }

  get auth() {
    if (!this._auth) {
      this._auth = initializeAuth(this.app, { persistence: browserLocalPersistence });
    }
    return this._auth;
  }

  get storage() {
    if (!this._storage) {
      this._storage = getStorage(this.app);
    }
    return this._storage;
  }

  get functions() {
    if (!this._functions) {
      this._functions = getFunctions(this.app, this.region);
    }
    return this._functions;
  }

  get analytics() {
    if (!this._analytics) {
      this._analytics = getAnalytics(this.app);
    }
    return this._analytics;
  }

  get dashboardUrl() {
    return `https://console.firebase.google.com/u/0/project/${this.projectId}`;
  }

  openDashboard() {
    window.open(this.dashboardUrl);
  }

  openDocumentReference(ref: DocumentReference) {
    const path = encodeURIComponent(ref.path);
    window.open(`${this.dashboardUrl}/firestore/data/${path}`);
  }

  serialized = $derived(serialized(this, ['projectId', 'region']));
}

const config = JSON.parse(PUBLIC_FIREBASE);
const region = PUBLIC_FIREBASE_REGION;

export const firebase = new Firebase(config, region);
