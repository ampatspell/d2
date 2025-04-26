import child from 'node:child_process';
import { mkdir, writeFile as _writeFile, readFile as _readFile } from 'fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const dirnameForFileURL = (url: string) => dirname(fileURLToPath(url));

export function isTruthy<T>(value?: T | undefined | null | false): value is T {
  return !!value;
}

export const exec = (command: string, cwd: string | undefined) => {
  return new Promise((resolve, reject) => {
    const shell = child.spawn(command, [], { stdio: 'inherit', shell: true, cwd });
    shell.on('error', (error) => {
      console.log(error);
    });
    shell.on('close', (code) => {
      if (code !== 0) {
        return reject(`exec failed with code ${code}`);
      }
      console.log();
      resolve(0);
    });
  });
};

export const mkdirp = async (path: string) => {
  await mkdir(path, { recursive: true });
};

export const writeString = async (path: string, data: string) => {
  await _writeFile(path, data, 'utf-8');
};

export const readString = async (path: string, optional = false) => {
  try {
    return await _readFile(path, 'utf-8');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch(err: any) {
    if(optional && err?.code === 'ENOENT') {
      return undefined;
    }
    throw err;
  }
};

export const readJSON = async (path: string, optional = false) => {
  const string = await readString(path, optional);
  if(string) {
    return JSON.parse(string);
  }
};

export const silence = () => {
  const emitWarning = process.emitWarning;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (process as any).emitWarning = (...args: Parameters<typeof process.emitWarning>) => {
    const [warning] = args;
    if (warning === 'glob is an experimental feature and might change at any time') {
      return;
    }
    emitWarning(...args);
  };
};
