import { gsap, useGSAP, initGSAP } from '../lib/gsap'
import { MOTION } from '../lib/motion'

/**
 * useReveal — branche un effet GSAP enregistré sur un élément, déclenché au scroll.
 *
 * Encapsule tout le "boilerplate" à ne plus jamais réécrire :
 *  - useGSAP (cleanup automatique au démontage : tweens, ScrollTriggers, SplitText),
 *  - ScrollTrigger standard du site (start: 'top 80%', une seule lecture),
 *  - ciblage d'enfants via `targets` (sélecteur interne au scope).
 *
 * @param {React.RefObject<HTMLElement>} scopeRef  élément déclencheur (et scope des sélecteurs)
 * @param {string} effect  nom d'un effet de src/effects ('fade', 'revealChars', ...)
 * @param {object} [options]
 * @param {string} [options.targets]  sélecteur des éléments à animer dans le scope (défaut : le scope lui-même)
 * @param {string} [options.start]    position ScrollTrigger (défaut : 'top 80%')
 * @param {boolean} [options.once]    true : joue une fois ; false : rejoue à rebours en remontant
 * @param {object} [options.scrollTrigger] options ScrollTrigger supplémentaires
 * @param {Array}  [deps]  dépendances qui recréent l'animation (ex. filtre actif)
 *
 * @example
 *   const ref = useRef(null)
 *   useReveal(ref, 'revealChars')
 *   return <h2 ref={ref}>Mes projets</h2>
 *
 * @example
 *   useReveal(gridRef, 'scaleIn', { targets: '.project-card', stagger: 0.1 })
 */
export function useReveal(scopeRef, effect, options = {}, deps = []) {
  const { targets, start = MOTION.start, once = true, scrollTrigger, ...vars } = options

  useGSAP(
    () => {
      initGSAP()
      const scope = scopeRef.current
      if (!scope) return

      const run = gsap.effects[effect]
      if (!run) {
        if (import.meta.env.DEV) console.warn(`[useReveal] effet inconnu : "${effect}"`)
        return
      }

      const elements = targets ? scope.querySelectorAll(targets) : scope
      if (targets && elements.length === 0) return

      run(elements, {
        ...vars,
        scrollTrigger: {
          trigger: scope,
          start,
          toggleActions: once ? 'play none none none' : 'play none none reverse',
          ...scrollTrigger,
        },
      })
    },
    { scope: scopeRef, dependencies: deps, revertOnUpdate: true },
  )
}
