import gsap from 'gsap'
import fade from './fade.effect'
import revealChars from './revealChars.effect'
import revealLines from './revealLines.effect'
import clipReveal from './clipReveal.effect'
import scaleIn from './scaleIn.effect'
import counter from './counter.effect'

/**
 * Registre des effets GSAP du site.
 *
 * Chaque fichier *.effect.js exporte un objet { name, effect, defaults, extendTimeline }
 * au format attendu par gsap.registerEffect(). Une fois enregistrés :
 *
 *   gsap.effects.fade(el, { y: 30 })                    // tween autonome
 *   gsap.effects.revealChars(h2, { scrollTrigger: {...} })
 *   tl.revealChars(h1).fade(cta, {}, '-=0.4')           // chaînable dans une timeline
 *                                                       // (si extendTimeline: true)
 *
 * Tous les effets :
 *  - acceptent `scrollTrigger` (ignoré quand l'effet est ajouté à une timeline),
 *  - respectent prefers-reduced-motion (simple fondu ou état final immédiat),
 *  - renvoient l'animation créée, pour pouvoir la piloter ou la tuer.
 *
 * Pour ajouter un effet : créer `monEffet.effect.js`, l'importer ici, l'ajouter à EFFECTS.
 */
export const EFFECTS = [fade, revealChars, revealLines, clipReveal, scaleIn, counter]

export function registerEffects() {
  EFFECTS.forEach((def) => {
    // garde-fou HMR : un effet ne s'enregistre qu'une fois
    if (!gsap.effects[def.name]) gsap.registerEffect(def)
  })
}

export const EFFECT_NAMES = EFFECTS.map((e) => e.name)
