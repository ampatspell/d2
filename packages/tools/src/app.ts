import { join } from 'node:path';
import type { Apps } from './apps';
import { exec, readJSON, writeString } from './utils';
import dedent from 'dedent-js';

const firebase_rc = (app: App) => dedent`
  {
    "projects": {
      "default": "${app.projectId}"
    },
    "targets": {
      "${app.projectId}": {
        "hosting": {
          "frontend": [
            "${app.projectId}"
          ],
          "backend": [
            "${app.projectId}-backend"
          ]
        }
      }
    }
  }

`;

const firebase_dot_env = (app: App) => dedent`
  ADMIN_EMAIL=${app.admin}
  REGION=${app.region}

`;

const firebase_json = (app: App) => dedent`
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
    "hosting": [
      {
        "source": "../../apps/${app.id}",
        "target": "frontend",
        "ignore": ["**/.*", "**/node_modules/**"],
        "frameworksBackend": {
          "region": "${app.region}"
        }
      },
      {
        "source": "../backend",
        "target": "backend",
        "ignore": ["**/.*", "**/node_modules/**"],
        "frameworksBackend": {
          "region": "${app.region}"
        }
      }
    ],
    "storage": {
      "rules": "rules/storage.rules"
    }
  }

`;

const backend_env = (app: App) => dedent`
  PUBLIC_FIREBASE='${JSON.stringify(app.firebase, null, 2)}'
  PUBLIC_FIREBASE_REGION=${app.region}
  PUBLIC_APP_NAME=${app.name}

`;

const frontend_env = (app: App) => backend_env(app);

export type AppConfig = {
  name?: string;
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

  get name() {
    return this.config.name ?? this.id;
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
    const backend = this._apps.backendRoot;
    const frontend = this.frontendRoot;
    await Promise.all([
      writeString(join(firebase, '.firebaserc'), firebase_rc(this)),
      writeString(join(firebase, 'firebase.json'), firebase_json(this)),
      writeString(join(firebase, 'functions', `.env.${this.projectId}`), firebase_dot_env(this)),
      writeString(join(backend, '.env'), backend_env(this)),
      writeString(join(frontend, '.env'), frontend_env(this)),
    ]);
  }

  async deploy() {
    await this.write();
    await exec(`firebase use default`, this._apps.firebaseRoot);
    await exec('npm run deploy', this._apps.firebaseRoot);
  }
}
