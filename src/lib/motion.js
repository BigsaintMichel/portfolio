import { useSyncExternalStore } from 'react'

/**
 * Mouvement réduit — source unique de vérité pour tout le site.
 *
 * - `prefersReducedMotion()` : lecture synchrone, utilisée par les effets GSAP
 *   au moment où ils sont créés.
 * - `useReducedMotion()` : hook réactif (se met à jour si l'utilisateur change
 *   le réglage système pendant la visite). Renvoie `false` au rendu serveur.
 * - `MOTION` : constantes partagées (durées, easings, staggers) pour que toutes
 *   les animations du site parlent le même langage.
 */

const QUERY = '(prefers-reduced-motion: reduce)'
const canMatch = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'

export function prefersReducedMotion() {
  return canMatch() ? window.matchMedia(QUERY).matches : false
}

function subscribe(callback) {
  if (!canMatch()) return () => {}
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false)
}

export const MOTION = {
  ease: {
    out: 'power3.out', // entrées
    inOut: 'expo.inOut', // transitions, rideaux
    soft: 'power2.out', // compteurs, petits mouvements
  },
  duration: {
    fast: 0.6,
    base: 0.9,
    slow: 1.2,
  },
  stagger: {
    chars: 0.05,
    lines: 0.08,
    cards: 0.1,
  },
  /** Déclencheur standard des reveals au scroll */
  start: 'top 80%',
}
