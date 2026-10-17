import { useRef, useState } from 'react'
import { gsap, useGSAP, initGSAP } from '../../lib/gsap'
import { lockScroll } from '../../lib/lenis'
import { prefersReducedMotion, MOTION } from '../../lib/motion'
import { SITE } from '../../constants/site'

const SESSION_KEY = 'ysm-intro-seen'
const MAX_WAIT = 2500 // ms : on n'attend jamais les polices plus longtemps

/**
 * Préloader — initiales + compteur 0→100 + barre, puis rideau qui se lève.
 *
 * - Joué une seule fois par session (sessionStorage) : les visites suivantes
 *   ont un simple fondu de 0,4 s, sans attente.
 * - Mouvement réduit : fondu immédiat.
 * - Le compteur suit une vraie condition (polices chargées), plafonnée à 2,5 s.
 * - `onDone` est appelé PENDANT la levée du rideau : le hero commence son
 *   entrée pendant que l'écran se découvre (chevauchement = fluidité).
 * - Présent dans le HTML pré-rendu (pas de flash du hero avant hydratation) ;
 *   si le JS échoue, le script de index.html le masque après 6 s.
 */
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const [gone, setGone] = useState(false)

  useGSAP(
    (context, contextSafe) => {
      initGSAP()
      const el = root.current
      lockScroll(true)

      const finish = () => {
        lockScroll(false)
        window.__introDone = true
        try {
          sessionStorage.setItem(SESSION_KEY, '1')
        } catch {
          /* navigation privée : sans importance */
        }
        onDone?.()
      }

      let seen = false
      try {
        seen = sessionStorage.getItem(SESSION_KEY) === '1'
      } catch {
        /* idem */
      }

      // — Version courte : déjà vu dans la session, ou mouvement réduit —
      if (seen || prefersReducedMotion()) {
        finish()
        gsap.to(el, { autoAlpha: 0, duration: 0.4, ease: 'power1.out', onComplete: () => setGone(true) })
        return
      }

      // — Version complète —
      const counterEl = el.querySelector('[data-count]')
      const bar = el.querySelector('[data-bar]')
      const letters = el.querySelectorAll('[data-letter]')
      const progress = { value: 0 }
      const render = () => {
        counterEl.textContent = String(Math.round(progress.value)).padStart(3, '0')
        gsap.set(bar, { scaleX: progress.value / 100 })
      }

      const intro = gsap.timeline()
      intro
        // fromTo : la position de départ (110 %) est aussi posée en CSS pour éviter un flash à l'hydratation
        .fromTo(
          letters,
          // y: 0 neutralise le translateY CSS (que GSAP lirait sinon comme un décalage en px)
          { yPercent: 110, y: 0 },
          { yPercent: 0, y: 0, duration: 0.8, stagger: 0.08, ease: MOTION.ease.out },
        )
        // Progression "simulée" jusqu'à 90 en attendant que tout soit prêt
        .to(progress, { value: 90, duration: 1.4, ease: 'power2.inOut', onUpdate: render }, 0.1)

      const fontsReady = document.fonts?.ready ?? Promise.resolve()
      const timeout = new Promise((resolve) => setTimeout(resolve, MAX_WAIT))
      const introPlayed = new Promise((resolve) => intro.eventCallback('onComplete', resolve))

      // contextSafe : la timeline de sortie, créée plus tard (asynchrone), est quand même
      // rattachée au contexte → nettoyée au démontage et sélecteurs limités au préloader.
      let cancelled = false
      const playExit = contextSafe(() => {
        if (cancelled) return
        gsap
          .timeline({ onComplete: () => setGone(true) })
          .to(progress, { value: 100, duration: 0.35, ease: 'power1.out', onUpdate: render })
          .to(letters, { yPercent: -110, duration: 0.6, stagger: 0.05, ease: 'power3.in' }, '+=0.1')
          .to('[data-meta]', { autoAlpha: 0, duration: 0.3 }, '<')
          .to(el, { yPercent: -100, duration: 1.1, ease: MOTION.ease.inOut }, '-=0.2')
          .add(finish, '-=0.65') // le hero démarre pendant la levée du rideau
      })

      Promise.all([Promise.race([fontsReady, timeout]), introPlayed]).then(playExit)

      return () => {
        cancelled = true
      }
    },
    { scope: root },
  )

  if (gone) return null

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink"
      role="status"
      aria-live="polite"
      aria-label="Chargement du site"
    >
      {/* Initiales — chaque lettre dans un masque */}
      <div className="flex font-display text-6xl font-bold tracking-tight sm:text-8xl" aria-hidden="true">
        {SITE.initials.split('').map((letter, i) => (
          <span key={i} className="overflow-clip pb-2">
            <span data-letter className={`inline-block ${i === 1 ? 'text-gradient' : 'text-text'}`}>
              {letter}
            </span>
          </span>
        ))}
      </div>

      {/* Compteur + barre */}
      <div data-meta className="mt-8 flex w-56 flex-col gap-3" aria-hidden="true">
        <div className="flex items-baseline justify-between font-mono text-xs text-muted">
          <span>Chargement</span>
          <span data-count className="tabular-nums text-cyan">
            000
          </span>
        </div>
        <div className="h-px w-full overflow-hidden bg-line">
          <div data-bar className="bg-gradient-neon h-full w-full origin-left scale-x-0" />
        </div>
      </div>
    </div>
  )
}
