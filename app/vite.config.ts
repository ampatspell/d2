import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
  plugins: [sveltekit(), devtoolsJson()],
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), '../d2'],
    },
  },
});
