import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Nettoyage des préchargements générés par vite-react-ssg.
 *
 * Par défaut, il précharge TOUS les assets atteignables depuis la page, y compris :
 *  - les ~45 fichiers de polices (chaque sous-ensemble : cyrillique, devanagari, .woff…),
 *  - la scène 3D et Three.js (≈ 320 Ko gzip) via les imports dynamiques.
 * Ces préchargements haute priorité concurrencent le CSS et le texte du hero (LCP).
 *
 * On ne garde que les 2 polices réellement visibles au premier écran (latin, woff2),
 * et on laisse Three.js se charger en lazy, pendant le préloader.
 */
const KEEP_FONTS = [/space-grotesk-latin-wght-normal-[^"]+\.woff2/, /poppins-latin-400-normal-[^"]+\.woff2/]
const LAZY_CHUNKS = /\/assets\/(three|HeroScene)-[^"]+\.js/

function trimPreloads(html) {
  return html
    .replace(/<link rel="preload" as="font"[^>]*>/g, (tag) => (KEEP_FONTS.some((re) => re.test(tag)) ? tag : ''))
    .replace(/<link rel="modulepreload"[^>]*>/g, (tag) => (LAZY_CHUNKS.test(tag) ? '' : tag))
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Options de vite-react-ssg (pré-rendu statique de chaque route au build).
  ssgOptions: {
    // /projets/tracelot → dist/projets/tracelot.html, servi en /projets/tracelot
    // grâce à "cleanUrls": true dans vercel.json (comportement standard Vercel).
    dirStyle: 'flat',
    formatting: 'none',
    onPageRendered: (_route, html) => trimPreloads(html),
  },

  build: {
    // Le chunk "three" (R3F importe Three.js en entier) dépasse 500 Ko : c'est attendu,
    // il est chargé en lazy et jamais préchargé (voir trimPreloads).
    chunkSizeWarningLimit: 1300,
    // Three.js est volumineux : on l'isole dans son propre chunk,
    // chargé uniquement par la scène du hero (lazy).
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three'
          if (id.includes('node_modules/gsap')) return 'gsap'
        },
      },
    },
  },
})
