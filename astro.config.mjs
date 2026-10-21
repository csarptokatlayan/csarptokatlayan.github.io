// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://copperhandstudio.com',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
