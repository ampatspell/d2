import * as p from '@clack/prompts';
import { glob } from 'node:fs/promises';
import { join } from 'node:path';

export class App {
  private readonly _apps: Apps;
  readonly name: string;

  constructor(apps: Apps, name: string) {
    this._apps = apps;
    this.name = name;
  }

  get isCurrent() {
    return this._apps.app === this;
  }
}

export class Apps {
  private readonly _app: Application;

  all: App[];

  constructor(app: Application) {
    this._app = app;
  }

  get root() {
    return join(this._app.root, 'apps');
  }

  async load() {
    const apps: App[] = [];
    for await (const entry of glob(`${this.root}/*`, { withFileTypes: true })) {
      if(entry.isDirectory()) {
        apps.push(new App(this, entry.name));
      }
    }
    this.all = apps;
  }

  get app() {
    return this.all[0];
  }

  async select(app: App) {
  }

  async index() {
    let app = await p.select<App>({
      message: `select an app`,
      initialValue: this.app,
      options: this.all.map(value => ({ value, label: value.name, hint: value.isCurrent ? 'current' : undefined })),
    });

    if(!p.isCancel(app)) {
      await this.select(app);
    }
  }
}

export type ApplicationOptions = {
  root: string;
};

export class Application {
  private readonly options: ApplicationOptions;
  private readonly apps: Apps;

  constructor(opts: ApplicationOptions) {
    this.options = opts;
    this.apps = new Apps(this);
  }

  get root() {
    return this.options.root;
  }

  async index() {
    console.clear();
    p.intro(`d2`);

    const apps = this.apps;
    await apps.load();

    p.log.info([`root: ${this.root}`, `app: ${apps.app.name}`].join('\n'));

    let tool = await p.select({
      message: 'select a tool',
      options: [
        {
          value: 'use',
          label: 'select an app',
        },
        {
          value: 'deploy',
          label: 'deploy current app',
        },
      ]
    });

    if(p.isCancel(tool)) {
      p.outro(`see ya`);
    } else {
      if(tool === 'use') {
        await apps.index();
        await this.index();
      } else if(tool === 'deploy') {
        p.outro('deploy…');
      }
    }
  }

  async main() {
    await this.index();
  }

  run() {
    this.main().catch(console.error);
  }
}
