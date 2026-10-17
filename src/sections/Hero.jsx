import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../lib/lenis'
import { MOTION, prefersReducedMotion, useReducedMotion } from '../lib/motion'
import { useIntro } from '../context/IntroContext'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { HERO, SITE } from '../constants/site'
import Button from '../components/ui/Button'
import Typewriter from '../components/ui/Typewriter'

// Three.js n'est chargé que dans le navigateur, et seulement si WebGL est dispo.
const HeroScene = lazy(() => import('../components/three/HeroScene'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext ? c.getContext('webgl2') : c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Section 1 — Hero
 *
 * Timeline orchestrée (déclenchée quand le rideau du préloader se lève) :
 *   badge → nom (SplitText, 0,05 s/char) → rôle → typewriter + pitch → CTA → scène 3D
 *
 * + parallaxe au scroll : le texte remonte plus vite que la scène et s'estompe.
 */
export default function Hero() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const sceneRef = useRef(null)
  const sceneParallaxRef = useRef(null)

  const { introDone } = useIntro()
  const reduced = useReducedMotion()
  const compact = useMediaQuery('(max-width: 767px)')
  const [typing, setTyping] = useState(false)
  const [webgl, setWebgl] = useState(false)
  const [inView, setInView] = useState(true)

  // WebGL détecté côté client uniquement (le HTML pré-rendu garde le halo CSS de secours)
  useEffect(() => setWebgl(hasWebGL()), [])

  // Hero hors écran → la scène 3D arrête de calculer
  useEffect(() => {
    const el = sectionRef.current
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* ── Timeline d'entrée ─────────────────────────────────────────────── */
  useGSAP(
    () => {
      if (!introDone) return
      const q = gsap.utils.selector(sectionRef)

      const tl = gsap.timeline({ defaults: { ease: MOTION.ease.out } })
      tl.fade(q('[data-hero="badge"]'), { y: 12, duration: 0.6 })
        .revealChars(q('[data-hero="title"]'), { stagger: MOTION.stagger.chars }, '-=0.25')
        .fade(q('[data-hero="role"]'), { y: 20 }, '-=0.9')
        .add(() => setTyping(true))
        .fade(q('[data-hero="pitch"]'), { y: 20 }, '<0.1')
        .fade(q('[data-hero="cta"]'), { y: 20, stagger: 0.1 }, '-=0.6')
        .fade(q('[data-hero="hint"]'), { y: 0, duration: 0.6 }, '-=0.4')
        // Pas de `scale` ici : R3F mesure son conteneur avec getBoundingClientRect,
        // un scale fausserait la taille du canvas. Translation + fondu uniquement.
        .fromTo(
          sceneRef.current,
          { autoAlpha: 0, y: prefersReducedMotion() ? 0 : 40 },
          { autoAlpha: 1, y: 0, duration: prefersReducedMotion() ? 0.3 : 1.6, ease: 'power2.out' },
          '-=1',
        )
    },
    { scope: sectionRef, dependencies: [introDone] },
  )

  /* ── Parallaxe de sortie au scroll ─────────────────────────────────── */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const st = { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to(contentRef.current, { yPercent: -18, opacity: 0.15, ease: 'none', scrollTrigger: st })
      gsap.to(sceneParallaxRef.current, { yPercent: 12, ease: 'none', scrollTrigger: { ...st } })
    },
    { scope: sectionRef, dependencies: [reduced] },
  )

  const onAnchor = (href) => (e) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <section
      ref={sectionRef}
      id="accueil"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh items-end overflow-hidden pt-28 pb-16 sm:pt-32 md:items-center md:pb-24"
    >
      {/* Halo de secours (sans WebGL / sans JS) + fond */}
      <div aria-hidden="true" className="hero-glow absolute inset-0 -z-20" />

      {/* Scène 3D — ~60% droits sur desktop, décalée sous la navbar */}
      <div ref={sceneParallaxRef} aria-hidden="true" className="absolute inset-0 -z-10 lg:top-24 lg:right-0 lg:bottom-8 lg:left-[38%]">
        <div ref={sceneRef} data-intro className="absolute inset-0 max-md:opacity-70">
          {webgl && (
            <Suspense fallback={null}>
              <HeroScene active={inView} reduced={reduced} compact={compact} eventSource={sectionRef} />
            </Suspense>
          )}
        </div>
      </div>

      {/* Dégradé de lisibilité : à gauche sur desktop (la scène reste vive à droite),
          du bas vers le haut sur mobile (le texte passe sous le noyau) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/80 via-45% to-transparent to-75% lg:bg-linear-to-r lg:from-ink/90 lg:via-ink/40 lg:via-35% lg:to-transparent lg:to-55%"
      />

      <div ref={contentRef} className="container-x">
        <div className="max-w-3xl max-md:pt-[34svh] lg:max-w-[38%]">
          {/* Badge disponibilité */}
          <p
            data-hero="badge"
            data-intro
            className="inline-flex items-center gap-2.5 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-1.5 font-mono text-xs text-cyan backdrop-blur-sm"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-cyan opacity-75 motion-safe:animate-ping-slow" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan" />
            </span>
            {SITE.availability}
          </p>

          {/* Nom */}
          <h1
            id="hero-title"
            data-hero="title"
            data-intro
            className="mt-6 font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] font-bold tracking-[-0.03em] text-text"
          >
            <span className="block">Yrigalé</span>
            <span className="block">Saint Michel</span>
          </h1>

          {/* Rôle + typewriter */}
          <p data-hero="role" data-intro className="mt-6 font-display text-xl font-medium sm:text-2xl">
            <span className="text-gradient">{SITE.title}</span>
          </p>
          <p data-hero="role" data-intro className="mt-2 font-mono text-sm text-cyan/90 sm:text-base">
            <span className="text-muted" aria-hidden="true">
              →{' '}
            </span>
            <Typewriter phrases={HERO.typewriter} play={typing} />
          </p>

          {/* Pitch */}
          <p data-hero="pitch" data-intro className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {HERO.pitch}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
            <span data-hero="cta" data-intro>
              <Button href={HERO.ctaPrimary.href} onClick={onAnchor(HERO.ctaPrimary.href)} arrow>
                {HERO.ctaPrimary.label}
              </Button>
            </span>
            <span data-hero="cta" data-intro>
              <Button href={HERO.ctaSecondary.href} onClick={onAnchor(HERO.ctaSecondary.href)} variant="ghost">
                {HERO.ctaSecondary.label}
              </Button>
            </span>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <a
        href="#a-propos"
        onClick={onAnchor('#a-propos')}
        data-hero="hint"
        data-intro
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-muted transition-colors hover:text-cyan sm:flex"
        aria-label="Défiler vers la section À propos"
      >
        <span className="eyebrow">Défiler</span>
        <span className="relative h-12 w-px overflow-hidden bg-line" aria-hidden="true">
          <span className="absolute inset-0 bg-cyan motion-safe:animate-scroll-line" />
        </span>
      </a>
    </section>
  )
}
