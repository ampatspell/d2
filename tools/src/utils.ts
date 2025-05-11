import child from 'node:child_process';
import { mkdir, writeFile as _writeFile, readFile as _readFile, unlink } from 'fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { statSync } from 'node:fs';

export const dirnameForFileURL = (url: string) => dirname(fileURLToPath(url));

export function isTruthy<T>(value?: T | undefined | null | false): value is T {
  return !!value;
}

export const exec = (command: string, cwd?: string) => {
  return new Promise((resolve, reject) => {
    const shell = child.spawn(command, [], { stdio: 'inherit', shell: true, cwd });
    shell.on('error', (error) => {
      console.log(error);
    });
    shell.on('close', (code) => {
      if (code !== 0) {
        return reject(`exec failed with code ${code}`);
      }
      resolve(0);
    });
  });
};

export const statOptional = (path: string) => {
  try {
    return statSync(path);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return undefined;
    }
    throw err;
  }
};

export const exists = (opts: { target: string; path: string }) => {
  const stat = statOptional(join(opts.target, opts.path));
  return !!stat;
};

export const symlink = async (opts: { source: string; target: string }) => {
  const target = resolve(opts.target);
  const source = relative(dirname(target), resolve(opts.source));
  const stat = statOptional(target);
  if (stat && !stat.isSymbolicLink()) {
    await unlink(target);
  }
  await mkdirp(dirname(target));
  await exec(`ln -s "${source}" "${target}"`);
};

export const symlinks = async (opts: { source: string; target: string; paths: string[] }) => {
  const { source, target, paths } = opts;
  await Promise.all(
    paths.map(async (path) => {
      await symlink({
        source: join(source, path),
        target: join(target, path),
      });
    }),
  );
};

export const mkdirp = async (path: string) => {
  await mkdir(path, { recursive: true });
};

export const writeString = async (path: string, data: string) => {
  await mkdirp(dirname(path));
  await _writeFile(path, data, 'utf-8');
};

export const readString = async (path: string, optional = false) => {
  try {
    return await _readFile(path, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (optional && err?.code === 'ENOENT') {
      return undefined;
    }
    throw err;
  }
};

export const readJSON = async (path: string, optional = false) => {
  const string = await readString(path, optional);
  if (string) {
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
