import { App } from 'firebase-admin/app';
import { Firestore, initializeFirestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import { inspect } from 'util';
import { Config } from './config';
import { Auth, getAuth } from 'firebase-admin/auth';
import { IdentityService } from './identity';
import { FilesService } from './files';
import { NodesService } from './nodes/nodes';

export type Logger = {
  info(...args: unknown[]): void;
};

export type ApplicationOptions = {
  instance: App;
  logger: Logger;
  config: Config;
};

export default class Application {
  _options: ApplicationOptions;

  firestore: Firestore;
  storage: Storage;
  auth: Auth;

  constructor(options: ApplicationOptions) {
    this._options = options;
    this.firestore = initializeFirestore(this._options.instance);
    this.storage = getStorage(this._options.instance);
    this.auth = getAuth(this._options.instance);
  }

  get config() {
    return this._options.config;
  }

  get bucket() {
    return this.storage.bucket();
  }

  get logger() {
    return this._options.logger;
  }

  get identity() {
    return new IdentityService(this);
  }

  get nodes() {
    return new NodesService(this);
  }

  get files() {
    return new FilesService(this);
  }

  dir(object: unknown) {
    return inspect(object, { depth: 8 });
  }
}
