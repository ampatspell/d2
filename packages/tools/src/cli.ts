import { join } from "node:path";
import { dirnameForFileURL, silence } from "./utils";
import { Application } from "./app";

silence();

const root = join(dirnameForFileURL(import.meta.url), '..', '..', '..');

const app = new Application({
  root,
});

app.run();
