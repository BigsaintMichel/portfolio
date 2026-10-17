import gsap from 'gsap'
import { prefersReducedMotion, MOTION } from '../lib/motion'

/**
 * fade — apparition en fondu avec léger décalage.
 *
 * @example gsap.effects.fade('.card', { y: 40, stagger: 0.1 })
 * @example tl.fade(cta, { y: 16 }, '-=0.4')
 *
 * Options : y, x, duration, ease, stagger, delay, scrollTrigger
 */
export default {
  name: 'fade',
  extendTimeline: true,
  defaults: {
    y: 24,
    x: 0,
    duration: MOTION.duration.base,
    ease: MOTION.ease.out,
    stagger: 0,
    delay: 0,
  },
  effect(targets, { y, x, duration, ease, stagger, delay, scrollTrigger }) {
    if (prefersReducedMotion()) {
      return gsap.fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, delay, scrollTrigger })
    }
    return gsap.fromTo(
      targets,
      { autoAlpha: 0, y, x },
      { autoAlpha: 1, y: 0, x: 0, duration, ease, stagger, delay, scrollTrigger },
    )
  },
}
