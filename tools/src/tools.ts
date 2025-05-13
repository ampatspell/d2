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
    p.intro(`d2 @ ${this.root}`);

    const { apps } = this;
    await apps.load();
    const current = apps.current;

    {
      if (current) {
        const rows: string[] = [];
        rows.push(`"${current.id}"`);
        rows.push(`${current.frontendRoot}`);
        rows.push(`${current.projectId}`)
        p.log.info(rows.join('\n'));
      }
    }

    const tool = await p.select({
      message: 'tools',
      options: [
        {
          value: 'use',
          label: 'select an app',
        },
        current && !current.isCanonical && {
          value: 'symlink',
          label: `symlink "${current.id}"`,
        },
        current && {
          value: 'deploy',
          label: `deploy "${current.id}"`,
        },
      ].filter(isTruthy),
    });

    if (p.isCancel(tool)) {
      p.outro(`bye`);
    } else {
      if (tool === 'use') {
        await apps.index();
        await this.index();
      } else if (tool === 'symlink') {
        if (current) {
          await current.symlink({
            warning: (message: string) => p.log.warning(message),
          });
          p.outro('done');
        }
      } else if (tool === 'deploy') {
        if (current) {
          await current.deploy();
          p.outro('done');
        }
      }
    }
  }

  run() {
    this.index().catch(console.error);
  }
}
