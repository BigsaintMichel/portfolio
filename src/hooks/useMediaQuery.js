import { useSyncExternalStore } from 'react'

/**
 * useMediaQuery — vrai si la media query correspond. `false` au rendu serveur
 * (le HTML pré-rendu est donc toujours la version "desktop sans préférence").
 *
 * @example const isMobile = useMediaQuery('(max-width: 767px)')
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
