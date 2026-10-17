import gsap from 'gsap'
import { prefersReducedMotion, MOTION } from '../lib/motion'

/**
 * clipReveal — révélation par clip-path (photo, visuels, filets de titre).
 *
 * `from` : direction d'où part la révélation.
 * `inner` : sélecteur optionnel d'un enfant (ex. 'img') qui dézoome pendant
 *           la révélation, pour l'effet "fenêtre qui s'ouvre" classique.
 *
 * @example gsap.effects.clipReveal(photo, { from: 'bottom', inner: 'img' })
 * @example tl.clipReveal(line, { from: 'left', duration: 0.8 })
 *
 * Options : from ('bottom'|'top'|'left'|'right'|'center'), inner, scale,
 *           duration, ease, delay, scrollTrigger
 */
const START = {
  bottom: 'inset(100% 0% 0% 0%)',
  top: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  center: 'inset(50% 50% 50% 50%)',
}
const END = 'inset(0% 0% 0% 0%)'

export default {
  name: 'clipReveal',
  extendTimeline: true,
  defaults: {
    from: 'bottom',
    inner: null,
    scale: 1.2,
    duration: MOTION.duration.slow,
    ease: 'power4.inOut',
    delay: 0,
  },
  effect(targets, { from, inner, scale, duration, ease, delay, scrollTrigger }) {
    if (prefersReducedMotion()) {
      return gsap.fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, clipPath: END, duration: 0.3, delay, scrollTrigger })
    }

    const tl = gsap.timeline({ delay, scrollTrigger })
    tl.fromTo(
      targets,
      { clipPath: START[from] ?? START.bottom, autoAlpha: 1 },
      { clipPath: END, duration, ease },
      0,
    )

    if (inner) {
      const children = gsap.utils.toArray(targets).flatMap((t) => gsap.utils.toArray(t.querySelectorAll(inner)))
      if (children.length) tl.fromTo(children, { scale }, { scale: 1, duration: duration * 1.25, ease: 'power3.out' }, 0)
    }
    return tl
  },
}
