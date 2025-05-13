import * as p from '@clack/prompts';
import { join, resolve } from 'node:path';
import type { Tools } from './tools';
import { App } from './app';
import { readJSON } from './utils';

type FirebaseRc = {
  projects: {
    default: string;
  };
};

type AppsConfig = {
  [key: string]: string;
};

export class Apps {
  private readonly _tools: Tools;

  all!: App[];
  currentProjectId?: string;

  constructor(app: Tools) {
    this._tools = app;
  }

  get root() {
    return this._tools.root
  }

  get appsRoot() {
    return join(this.root, 'apps');
  }

  get firebaseRoot() {
    return join(this.root, 'firebase');
  }

  get appRoot() {
    return join(this.root, 'app');
  }

  async load() {
    const all = async () => {
      const apps: App[] = [];
      const json = await readJSON(join(this.root, 'd2.json')) as AppsConfig;
      for(const id in json) {
        const path = resolve(join(this.root, json[id]));
        apps.push(new App(this, id, path));
      }
      apps.push(new App(this, 'base app', join(this.root, 'app')));
      await Promise.all(apps.map((app) => app.load()));
      return apps;
    };

    const firebase = async () => {
      const json = (await readJSON(join(this.firebaseRoot, '.firebaserc'), true)) as FirebaseRc | undefined;
      return json?.projects.default;
    };

    this.all = await all();
    this.currentProjectId = await firebase();
  }

  get current(): App | undefined {
    const projectId = this.currentProjectId;
    if (projectId) {
      return this.all.find((app) => app.projectId === projectId);
    }
    return undefined;
  }

  async select(app: App) {
    await app.write();
  }

  async index() {
    const app = await p.select<App>({
      message: `select an app`,
      initialValue: this.current,
      options: this.all.map((value) => ({ value, label: value.id, hint: value.isCurrent ? 'current' : undefined })),
    });

    if (!p.isCancel(app)) {
      await this.select(app);
    }
  }
}
