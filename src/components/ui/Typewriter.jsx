import { useEffect, useRef } from 'react'
import { gsap, initGSAP } from '../../lib/gsap'
import { useReducedMotion } from '../../lib/motion'

const HOLD = 1.8 // s d'affichage d'une phrase complète
const TYPE_SPEED = 0.055 // s par caractère tapé
const DELETE_SPEED = 0.025 // s par caractère effacé

/**
 * Typewriter piloté par une timeline GSAP (pas de setInterval).
 *
 * - La 1re phrase est rendue en HTML statique (SEO, pas d'écart d'hydratation).
 * - Le texte est écrit directement dans le DOM via une ref : aucun re-render
 *   React à 60 fps.
 * - Lecteurs d'écran : le texte animé est aria-hidden ; une version statique
 *   listant toutes les phrases est fournie en sr-only.
 * - Mouvement réduit : la 1re phrase reste fixe, sans curseur clignotant.
 *
 * @param {string[]} phrases
 * @param {boolean} play  démarre l'animation (le hero l'active dans sa timeline)
 */
export default function Typewriter({ phrases, play = false, className = '' }) {
  const textRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!play || reduced || phrases.length < 2) return
    initGSAP()
    const el = textRef.current
    const write = (str) => {
      el.textContent = str
    }

    const tl = gsap.timeline({ repeat: -1 })
    phrases.forEach((current, i) => {
      const next = phrases[(i + 1) % phrases.length]
      const del = { n: current.length }
      const typ = { n: 0 }
      tl.to(del, {
        n: 0,
        duration: current.length * DELETE_SPEED,
        ease: 'none',
        onUpdate: () => write(current.slice(0, Math.round(del.n))),
      }, `+=${HOLD}`)
      tl.to(typ, {
        n: next.length,
        duration: next.length * TYPE_SPEED,
        ease: 'none',
        onUpdate: () => write(next.slice(0, Math.round(typ.n))),
      }, '+=0.25')
    })

    return () => {
      tl.kill()
      write(phrases[0])
    }
  }, [play, reduced, phrases])

  return (
    <span className={className}>
      <span className="sr-only">{phrases.join(', ')}</span>
      <span aria-hidden="true">
        <span ref={textRef}>{phrases[0]}</span>
        <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-cyan motion-safe:animate-blink" />
      </span>
    </span>
  )
}
