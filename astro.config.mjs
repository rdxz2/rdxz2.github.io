import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rdxz2.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
});
