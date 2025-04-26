import child from 'node:child_process';
import { mkdir, writeFile as _writeFile, readFile as _readFile } from 'fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const dirnameForFileURL = (url: string) => dirname(fileURLToPath(url));

export const exec = (command: string) => {
  return new Promise((resolve, reject) => {
    const shell = child.spawn(command, [], { stdio: 'inherit', shell: true });
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

export const readString = async (path: string) => {
  return await _readFile(path, 'utf-8');
};

export const readJSON = async (path: string) => {
  return JSON.parse(await readString(path));
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
