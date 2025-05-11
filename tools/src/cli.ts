import { join } from 'node:path';
import { dirnameForFileURL, silence } from './utils';
import { Tools } from './tools';

silence();

const root = join(dirnameForFileURL(import.meta.url), '..', '..');

new Tools({ root }).run();
