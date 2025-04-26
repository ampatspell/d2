import * as p from '@clack/prompts';
import { Apps } from './apps';
import { isTruthy } from './utils';

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

    const { apps } = this;
    await apps.load();
    const current = apps.current;

    {
      const rows = [`root: ${this.root}`];
      if(current) {
        rows.push(`app: ${current.id} @ ${current.projectId}`);
      }
      p.log.info(rows.join('\n'));
    }

    const tool = await p.select({
      message: 'tools',
      options: [
        {
          value: 'use',
          label: 'select an app',
        },
        current && {
          value: 'deploy',
          label: 'deploy current app',
        },
      ].filter(isTruthy),
    });

    if (p.isCancel(tool)) {
      p.outro(`see ya`);
    } else {
      if (tool === 'use') {
        await apps.index();
        await this.index();
      } else if (tool === 'deploy') {
        if(current) {
          await current.deploy();
        }
      }
    }
  }

  run() {
    this.index().catch(console.error);
  }
}
