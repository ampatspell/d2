import type { Apps } from "./apps";

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
