import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import { initGSAP } from './lib/gsap'
import './styles/index.css'

/**
 * Point d'entrée vite-react-ssg.
 * - En build : chaque route est rendue en HTML statique (SEO + Open Graph lisibles par les robots).
 * - Côté client : l'app s'hydrate ; GSAP n'est initialisé que dans le navigateur.
 */
export const createRoot = ViteReactSSG({ routes }, ({ isClient }) => {
  if (isClient) initGSAP()
})
