import * as p from '@clack/prompts';
import { join } from 'node:path';
import type { Tools } from './tools';
import { glob } from 'node:fs/promises';
import { App } from './app';

export class Apps {
  private readonly _app: Tools;

  all!: App[];

  constructor(app: Tools) {
    this._app = app;
  }

  get root() {
    return join(this._app.root, 'apps');
  }

  async load() {
    const apps: App[] = [];
    for await (const entry of glob(`${this.root}/*`, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        apps.push(new App(this, entry.name));
      }
    }
    await Promise.all(apps.map((app) => app.load()));
    this.all = apps;
  }

  get app() {
    return this.all[0];
  }

  async select(app: App) {
    await this.load();
    console.log(app);
  }

  async index() {
    const app = await p.select<App>({
      message: `select an app`,
      initialValue: this.app,
      options: this.all.map((value) => ({ value, label: value.id, hint: value.isCurrent ? 'current' : undefined })),
    });

    if (!p.isCancel(app)) {
      await this.select(app);
    }
  }
}
