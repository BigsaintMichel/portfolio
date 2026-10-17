import gsap from 'gsap'
import { prefersReducedMotion, MOTION } from '../lib/motion'

/**
 * scaleIn — entrée par léger zoom + fondu (cartes, badges, vignettes).
 *
 * @example gsap.effects.scaleIn('.project-card', { stagger: 0.1, scrollTrigger: {...} })
 *
 * Options : scale (valeur de départ), y, duration, ease, stagger, delay, scrollTrigger
 */
export default {
  name: 'scaleIn',
  extendTimeline: true,
  defaults: {
    scale: 0.92,
    y: 20,
    duration: MOTION.duration.base,
    ease: MOTION.ease.out,
    stagger: MOTION.stagger.cards,
    delay: 0,
  },
  effect(targets, { scale, y, duration, ease, stagger, delay, scrollTrigger }) {
    if (prefersReducedMotion()) {
      return gsap.fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, delay, scrollTrigger })
    }
    return gsap.fromTo(
      targets,
      { autoAlpha: 0, scale, y, transformOrigin: '50% 60%' },
      { autoAlpha: 1, scale: 1, y: 0, duration, ease, stagger, delay, scrollTrigger },
    )
  },
}
