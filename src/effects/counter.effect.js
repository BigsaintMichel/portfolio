import gsap from 'gsap'
import { prefersReducedMotion, MOTION } from '../lib/motion'

/**
 * counter — compteur animé (stats).
 *
 * Principe demandé par le brief : on tweene un objet { value } puis on écrit
 * la valeur formatée dans l'élément à chaque frame.
 *
 * La valeur cible peut venir de l'option `end` ou de l'attribut data-count-to
 * de chaque élément (pratique pour animer plusieurs stats en un appel) ;
 * idem pour les décimales via data-decimals.
 *
 * SEO / sans JS : le HTML pré-rendu contient la valeur finale. L'effet remet
 * le compteur à `start` uniquement quand il est créé côté client.
 *
 * @example gsap.effects.counter('[data-count-to]', { scrollTrigger: {...} })
 * @example tl.counter(el, { end: 9, suffix: '+' })
 *
 * Options : start, end, decimals, prefix, suffix, locale, duration, ease, stagger, delay, scrollTrigger
 */
export default {
  name: 'counter',
  extendTimeline: true,
  defaults: {
    start: 0,
    end: 0,
    decimals: 0,
    prefix: '',
    suffix: '',
    locale: 'fr-FR',
    duration: 2,
    ease: MOTION.ease.soft,
    stagger: 0.15,
    delay: 0,
  },
  effect(targets, { start, end, decimals, prefix, suffix, locale, duration, ease, stagger, delay, scrollTrigger }) {
    const formatter = (digits) =>
      new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
    const elements = gsap.utils.toArray(targets)
    const reduced = prefersReducedMotion()
    const tl = gsap.timeline({ delay, scrollTrigger })

    elements.forEach((el, i) => {
      const target = el.dataset.countTo != null ? parseFloat(el.dataset.countTo) : end
      const format = formatter(el.dataset.decimals != null ? parseInt(el.dataset.decimals, 10) : decimals)
      const state = { value: reduced ? target : start }
      const render = () => {
        el.textContent = `${prefix}${format.format(state.value)}${suffix}`
      }
      render()
      if (reduced) return
      tl.to(state, { value: target, duration, ease, onUpdate: render }, i * stagger)
    })

    return tl
  },
}
