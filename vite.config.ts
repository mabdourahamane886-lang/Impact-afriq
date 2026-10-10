import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        evenements: new URL('./evenements/index.html', import.meta.url).pathname,
        informations: new URL('./informations/index.html', import.meta.url).pathname,
        partenariats: new URL('./partenariats/index.html', import.meta.url).pathname,
        actualites: new URL('./actualites/index.html', import.meta.url).pathname,
        ressources: new URL('./ressources/index.html', import.meta.url).pathname,
      },
    },
  },
});
