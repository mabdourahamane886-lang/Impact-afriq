import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/',
  appType: 'mpa',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'informations/index.html'),
        expertises: resolve(__dirname, 'expertises/index.html'),
        projets: resolve(__dirname, 'projets/index.html'),
        evenements: resolve(__dirname, 'evenements/index.html'),
        nicatfest: resolve(__dirname, 'evenements/nicatfest-2026/index.html'),
        actualites: resolve(__dirname, 'actualites/index.html'),
        partenariats: resolve(__dirname, 'partenariats/index.html'),
        ressources: resolve(__dirname, 'ressources/index.html'),
        impact: resolve(__dirname, 'impact/index.html'),
        temoignages: resolve(__dirname, 'temoignages/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
});
