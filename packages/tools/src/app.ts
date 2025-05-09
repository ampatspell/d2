import { join } from 'node:path';
import type { Apps } from './apps';
import { exec, exists, readJSON, symlinks, writeString } from './utils';
import dedent from 'dedent-js';

const firebase_rc = (app: App) => dedent`
  {
    "projects": {
      "default": "${app.projectId}"
    }
  }

`;

const firebase_dot_env = (app: App) => dedent`
  ADMIN_EMAIL=${app.admin}
  REGION=${app.region}

`;

const firebase_json = (app: App) => {
  return dedent`
    {
      "$schema": "https://raw.githubusercontent.com/firebase/firebase-tools/master/schema/firebase-config.json",
      "firestore": {
        "rules": "rules/firestore.rules",
        "indexes": "rules/firestore.indexes.json"
      },
      "functions": [
        {
          "source": "functions",
          "codebase": "d2",
          "ignore": ["node_modules", "firebase-debug.log", "firebase-debug.*.log", "test"],
          "predeploy": [
            "npm --prefix \\"$RESOURCE_DIR\\" run build"
          ]
        }
      ],
      "hosting": {
        "source": "../../apps/${app.id}",
        "ignore": ["**/.*", "**/node_modules/**"],
        "frameworksBackend": {
          "region": "${app.region}"
        }
      },
      "storage": {
        "rules": "rules/storage.rules"
      }
    }

  `;
};

const frontend_env = (app: App) => dedent`
  PUBLIC_FIREBASE='${JSON.stringify(app.firebase, null, 2)}'
  PUBLIC_FIREBASE_REGION=${app.region}
  PUBLIC_APP_NAME=${app.id}

`;

const frontend_layout = () => dedent`
  <script lang="ts">
    import Layout from '$d2/components/layout.svelte';
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();

    let fonts = [
      'https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap'
    ];
  </script>

  <Layout {fonts}>
    <div class="frontend">
      {@render children()}
    </div>
  </Layout>

  <style lang="scss">
    .frontend {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-family: 'Raleway', sans-serif;
      font-size: 13px;
      font-weight: 400;
      cursor: default;
    }
  </style>
`;

const frontend_page = () => dedent`
  <script lang="ts">
    import { PUBLIC_FIREBASE, PUBLIC_APP_NAME } from "$env/static/public";
    let config = JSON.parse(PUBLIC_FIREBASE);
  </script>

  <div class="page">
    <div class="row">
      {PUBLIC_APP_NAME} / {config.projectId}
    </div>
    <div class="row">
      <a href="/backend">backend</a>
    </div>
  </div>

  <style lang="scss">
    .page {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
      align-items: center;
      justify-content: center;
      padding: 50px;
    }
  </style>

`;

const svelte_config = () => dedent`
  import adapter from '@sveltejs/adapter-node';
  import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

  /** @type {import('@sveltejs/kit').Config} */
  const config = {
    vitePlugin: {
      inspector: true,
    },
    preprocess: vitePreprocess(),
    kit: {
      adapter: adapter(),
      alias: {
        '$lib/*': 'src/lib/*',
        '$d2/*': 'src/d2/*',
        '$d2-shared/*': '../../firebase/functions/shared/*',
      },
    },
  };

  export default config;
`;

export type AppConfig = {
  admin: string;
  region: string;
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

  get frontendRoot() {
    return join(this._apps.appsRoot, this.id);
  }

  get isCurrent() {
    return this._apps.current === this;
  }

  get admin() {
    return this.config.admin;
  }

  get firebase() {
    return this.config.firebase;
  }

  get projectId() {
    return this.config.firebase.projectId;
  }

  get region() {
    return this.config.region;
  }

  async load() {
    this.config = (await readJSON(join(this.frontendRoot, 'd2.json'))) as AppConfig;
  }

  async write() {
    const firebase = this._apps.firebaseRoot;
    const app = this._apps.appRoot;
    const frontend = this.frontendRoot;

    await Promise.all([
      writeString(join(firebase, '.firebaserc'), firebase_rc(this)),
      writeString(join(firebase, 'firebase.json'), firebase_json(this)),
      writeString(join(firebase, 'functions', `.env.${this.projectId}`), firebase_dot_env(this)),
      writeString(join(app, '.env'), frontend_env(this)),
      writeString(join(frontend, '.env'), frontend_env(this)),
    ]);
  }

  async symlink(log: { warning: (message: string) => void }) {
    await this.write();

    const source = this._apps.appRoot;
    const target = this.frontendRoot;
    await symlinks({
      paths: [
        'vite.config.ts',
        'tsconfig.json',
        'eslint.config.js',
        '.prettierrc',
        'src/d2',
        'src/hooks.ts',
        'src/routes/(backend)',
      ],
      source,
      target,
    });

    await writeString(join(target, 'svelte.config.js'), svelte_config());

    if (!exists({ path: 'src/routes/(frontend)', target })) {
      await Promise.all([
        writeString(join(target, 'src/routes/(frontend)/+layout.svelte'), frontend_layout()),
        writeString(join(target, 'src/routes/(frontend)/+page.svelte'), frontend_page()),
      ]);
    }
    if (exists({ path: 'src/routes/+page.svelte', target })) {
      log.warning('please move src/routes/+page.svelte to src/routes/(frontend)');
    }
  }

  async deploy() {
    await this.write();

    const root = this._apps.firebaseRoot;
    await exec('firebase deploy --project=default', root);
  }
}
