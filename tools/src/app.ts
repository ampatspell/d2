import { join, relative } from 'node:path';
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
  REGION_FUNCTIONS=${app.region.functions}
  REGION_BUCKET=${app.region.bucket}

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
        "source": "${app.frontendRootRelativeToFirebase}",
        "ignore": ["**/.*", "**/node_modules/**"],
        "frameworksBackend": {
          "region": "${app.region.functions}"
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
  PUBLIC_FIREBASE_REGION=${app.region.functions}
  PUBLIC_APP_NAME=${app.id}

`;

const frontend_layout = (app: App) => dedent`
  <script lang="ts">
    import Layout from '$d2/components/layout.svelte';
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();

    let fonts = [
      'https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap'
    ];
  </script>

  <svelte:head>
    <title>${app.id}</title>
  </svelte:head>

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

const svelte_config = (app: App) => dedent`
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
        '$d2-shared/*': '${app.functionsSharedRootRelativeToFrontend}',
      },
    },
  };

  export default config;
`;

const vite_config = (app: App) => dedent`
  import { sveltekit } from '@sveltejs/kit/vite';
  import { defineConfig, searchForWorkspaceRoot } from 'vite';

  export default defineConfig({
    plugins: [sveltekit()],
    server: {
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          '${app.rootRelativeToFrontend}'
        ]
      }
    }
  });
`

const registry = () => dedent`
  import { file } from '$d2/lib/definition/file/definition.svelte';
  import { app } from '$d2/lib/definition/utils.svelte';
  import type { FunctionsNodePropertiesRegistry } from '$d2-shared/nodes/registry';

  export type NodePropertiesRegistry = FunctionsNodePropertiesRegistry;

  export const definition = app({
    nodes: [file()],
  });

`;

const package_json = (app: App) => dedent`
  {
    "name": "${app.id}",
    "private": true,
    "version": "0.0.1",
    "type": "module",
    "scripts": {
      "dev": "vite dev",
      "build": "vite build",
      "preview": "vite preview",
      "prepare": "svelte-kit sync || echo ''",
      "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
      "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
      "format": "prettier --write .",
      "lint": "prettier --check . && eslint .",
      "cli": "(cd ${app.rootRelativeToFrontend} && npm run cli)",
      "flc": "npm run format && npm run lint && npm run check"
    },
    "dependencies": {
      "@firebase/auth": "^1.8.1",
      "@firebase/firestore": "^4.7.5",
      "@firebase/functions": "^0.11.10",
      "@firebase/storage": "^0.13.4",
      "firebase": "^11.0.2",
      "p-limit": "^6.2.0",
      "fast-deep-equal": "^3.1.3"
    },
    "devDependencies": {
      "@eslint/compat": "^1.2.5",
      "@eslint/js": "^9.18.0",
      "@sveltejs/adapter-node": "^5.0.0",
      "@sveltejs/kit": "^2.16.0",
      "@sveltejs/vite-plugin-svelte": "^5.0.0",
      "eslint": "^9.18.0",
      "eslint-config-prettier": "^10.0.1",
      "eslint-plugin-svelte": "^3.0.0",
      "globals": "^16.0.0",
      "prettier": "^3.4.2",
      "prettier-plugin-svelte": "^3.3.3",
      "sass-embedded": "^1.88.0",
      "svelte": "^5.0.0",
      "svelte-check": "^4.0.0",
      "typescript": "^5.0.0",
      "typescript-eslint": "^8.20.0",
      "vite": "^6.2.6"
    },
    "engines": {
      "node": "22"
    }
  }
`;

const nvmrc = () => dedent`
  22

`;

export type AppConfig = {
  admin: string;
  region: {
    functions: string;
    bucket: string;
  };
  firebase: {
    projectId: string;
  };
};

export class App {
  private readonly _apps: Apps;
  readonly id: string;
  readonly path: string;

  private config!: AppConfig;

  constructor(apps: Apps, id: string, path: string) {
    this._apps = apps;
    this.id = id;
    this.path = path;
  }

  get isCanonical() {
    return this._apps.appRoot === this.path;
  }

  get isExcluded() {
    return this.isCanonical && !this.config;
  }

  get frontendRoot() {
    return this.path;
  }

  get rootRelativeToFrontend() {
    return relative(this.frontendRoot, this._apps.root);
  }

  get frontendRootRelativeToFirebase() {
    return relative(this._apps.firebaseRoot, this.frontendRoot);
  }

  get functionsSharedRootRelativeToFrontend() {
    const path = relative(this.frontendRoot, join(this._apps.firebaseRoot, 'functions/shared'));
    return `${path}/*`;
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
    this.config = (await readJSON(join(this.frontendRoot, 'd2.json'), true)) as AppConfig;
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
        'src/routes/+error.svelte',
        'static/d2',
      ],
      source,
      target,
    });

    await writeString(join(target, '.nvmrc'), nvmrc());
    await writeString(join(target, 'package.json'), package_json(this));
    await writeString(join(target, 'vite.config.ts'), vite_config(this));
    await writeString(join(target, 'svelte.config.js'), svelte_config(this));

    if (!exists({ path: 'src/lib/definition/registry.ts', target })) {
      await writeString(join(target, 'src/lib/definition/registry.ts'), registry());
    }

    if (!exists({ path: 'src/routes/(frontend)', target })) {
      await Promise.all([
        writeString(join(target, 'src/routes/(frontend)/+layout.svelte'), frontend_layout(this)),
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
