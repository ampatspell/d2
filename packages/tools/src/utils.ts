import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const dirnameForFileURL = (url: string) => dirname(fileURLToPath(url));

export const silence = () => {
  const emitWarning = process.emitWarning;
  (process as any).emitWarning = (...args: Parameters<typeof process.emitWarning>) => {
    const [warning, ...rest] = args;
    if(warning === 'glob is an experimental feature and might change at any time') {
      return;
    }
    emitWarning(...args);
  }
}
