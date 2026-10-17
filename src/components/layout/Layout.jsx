import { Suspense, useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ScrollTrigger, initGSAP } from '../../lib/gsap'
import { initLenis, destroyLenis, getLenis, scrollToTarget } from '../../lib/lenis'
import { useReducedMotion } from '../../lib/motion'
import { IntroContext } from '../../context/IntroContext'
import Preloader from './Preloader'
import Navbar from './Navbar'

/**
 * Layout commun à toutes les pages : préloader, navbar, smooth scroll.
 * (Le footer unique arrivera ici à l'étape suivante → plus de footers divergents.)
 */
export default function Layout() {
  const [introDone, setIntroDone] = useState(false)
  const reduced = useReducedMotion()
  const { pathname, hash } = useLocation()

  // Lenis : (ré)initialisé si l'utilisateur change sa préférence de mouvement
  useEffect(() => {
    initGSAP()
    initLenis()
    return () => destroyLenis()
  }, [reduced])

  // Une fois l'intro finie, la mise en page est stable : on recalcule les ScrollTriggers
  useEffect(() => {
    if (introDone) ScrollTrigger.refresh()
  }, [introDone])

  // Navigation entre pages : retour en haut, ou vers l'ancre demandée (/#projets)
  useEffect(() => {
    if (hash) {
      const id = window.setTimeout(() => scrollToTarget(hash, { immediate: !introDone }), 60)
      return () => window.clearTimeout(id)
    }
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash])

  const handleIntroDone = useCallback(() => setIntroDone(true), [])

  return (
    <IntroContext.Provider value={{ introDone }}>
      <div className="noise">
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        <Preloader onDone={handleIntroDone} />
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </IntroContext.Provider>
  )
}
