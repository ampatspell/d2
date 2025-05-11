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
      '$d2-shared/*': '../firebase/functions/shared/*',
    },
  },
};

export default config;
