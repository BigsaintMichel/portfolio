import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './motion'

/**
 * Smooth scroll Lenis, piloté par le ticker GSAP.
 *
 * Pourquoi le ticker GSAP plutôt que requestAnimationFrame ?
 * Lenis et ScrollTrigger avancent alors sur la même horloge : les animations
 * liées au scroll (scrub, pin) ne décrochent jamais d'une frame.
 *
 * Mouvement réduit → pas de Lenis du tout : scroll natif, instantané.
 */

const HEADER_OFFSET = -88 // hauteur du header fixe (+ marge)

let lenis = null
let tick = null
let locked = false // mémorise un verrou posé avant la création de Lenis (préloader)

export function initLenis() {
  if (typeof window === 'undefined') return null
  if (lenis) return lenis
  if (prefersReducedMotion()) return null

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out
    smoothWheel: true,
    syncTouch: false, // scroll tactile natif sur mobile : plus fiable, moins coûteux
  })

  // 1) Chaque scroll Lenis met ScrollTrigger à jour
  lenis.on('scroll', ScrollTrigger.update)

  // 2) Lenis avance au rythme du ticker GSAP (secondes → ms)
  tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)

  // 3) Pas de "rattrapage" après un onglet en arrière-plan : évite les sauts
  gsap.ticker.lagSmoothing(0)

  if (locked) lenis.stop()
  return lenis
}

export function destroyLenis() {
  if (!lenis) return
  gsap.ticker.remove(tick)
  gsap.ticker.lagSmoothing(500, 33) // valeur par défaut de GSAP
  lenis.destroy()
  lenis = null
  tick = null
}

export const getLenis = () => lenis

/**
 * Défilement vers une cible (sélecteur, élément ou nombre).
 * Lenis si actif ; sinon ScrollToPlugin (instantané en mouvement réduit).
 */
export function scrollToTarget(target, { offset = HEADER_OFFSET, immediate = false } = {}) {
  if (typeof window === 'undefined') return
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (el == null) return

  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.2, immediate })
  } else {
    gsap.to(window, {
      scrollTo: { y: el, offsetY: -offset, autoKill: true },
      duration: immediate || prefersReducedMotion() ? 0 : 0.9,
      ease: 'power3.inOut',
    })
  }

  // Accessibilité : le focus suit le défilement (sans re-scroller)
  if (el instanceof HTMLElement) {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }
}

/** Bloque/débloque le scroll (préloader, menu mobile). */
export function lockScroll(value) {
  if (typeof document === 'undefined') return
  locked = value
  if (lenis) (value ? lenis.stop() : lenis.start())
  document.documentElement.style.overflow = value ? 'hidden' : ''
}
