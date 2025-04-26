import * as p from '@clack/prompts';
import { Apps } from './apps';

export type ApplicationOptions = {
  root: string;
};

export class Tools {
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

    p.log.info([`root: ${this.root}`, `app: ${apps.app.id} @ ${apps.app.projectId}`].join('\n'));

    const tool = await p.select({
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
      ],
    });

    if (p.isCancel(tool)) {
      p.outro(`see ya`);
    } else {
      if (tool === 'use') {
        await apps.index();
        await this.index();
      } else if (tool === 'deploy') {
        p.outro('deploy…');
      }
    }
  }

  run() {
    this.index().catch(console.error);
  }
}
