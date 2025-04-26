import { join } from 'node:path';
import type { Apps } from './apps';
import { readJSON } from './utils';

export type AppConfig = {
  name?: string;
  admin: string;
  firebase: {
    projectId: string;
  };
};

export class App {
  private readonly _apps: Apps;
  readonly id: string;

  private config!: AppConfig;

  constructor(apps: Apps, id: string) {
    this._apps = apps;
    this.id = id;
  }

  get root() {
    return join(this._apps.root, this.id);
  }

  get isCurrent() {
    return this._apps.app === this;
  }

  get name() {
    return this.config.name ?? this.id;
  }

  get projectId() {
    return this.config.firebase.projectId;
  }

  async load() {
    this.config = (await readJSON(join(this.root, 'd2.json'))) as AppConfig;
  }
}
