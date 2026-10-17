import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { lockScroll, scrollToTarget } from '../../lib/lenis'
import { prefersReducedMotion, MOTION } from '../../lib/motion'
import { useIntro } from '../../context/IntroContext'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { NAV_LINKS, SITE, SOCIALS } from '../../constants/site'

/**
 * Navbar
 *  - Desktop : nav en pills (signature conservée) + indicateur qui glisse sous la section active.
 *  - Se masque au scroll vers le bas, réapparaît au scroll vers le haut (ou au focus clavier).
 *  - Mobile : bouton hamburger → menu plein écran révélé en cercle depuis le bouton (GSAP).
 *  - Accessibilité : aria-expanded/controls, Échap pour fermer, focus piégé dans le menu,
 *    contenu de la page rendu `inert` pendant l'ouverture, focus rendu au bouton à la fermeture.
 */
export default function Navbar() {
  const headerRef = useRef(null)
  const barRef = useRef(null) // la barre (et non <header>) est translatée : un transform sur <header>
  //                             deviendrait le repère des enfants `fixed` et casserait le menu plein écran
  const navRef = useRef(null)
  const indicatorRef = useRef(null)
  const menuRef = useRef(null)
  const burgerRef = useRef(null)
  const menuTl = useRef(null)
  const openRef = useRef(false)

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('accueil')
  const [scrolled, setScrolled] = useState(false)

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { introDone } = useIntro()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isHome = pathname === '/'

  /* ── 1. Entrée du header après le préloader ─────────────────────────── */
  useGSAP(
    () => {
      if (!introDone) return
      gsap.effects.fade('[data-nav-item]', { y: -14, stagger: 0.07, duration: 0.7, delay: 0.5 })
    },
    { scope: headerRef, dependencies: [introDone] },
  )

  /* ── 2. Masquer / afficher selon le sens du scroll ──────────────────── */
  useGSAP(
    () => {
      const header = headerRef.current
      const show = (visible) =>
        gsap.to(barRef.current, { yPercent: visible ? 0 : -200, duration: 0.45, ease: MOTION.ease.out, overwrite: 'auto' })

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate(self) {
          const y = self.scroll()
          setScrolled(y > 24)
          if (openRef.current || header.contains(document.activeElement)) return show(true)
          show(!(self.direction === 1 && y > 240))
        },
      })
    },
    { scope: headerRef },
  )

  /* ── 3. Section active (page d'accueil uniquement) ──────────────────── */
  useGSAP(
    () => {
      if (!isHome) return
      NAV_LINKS.forEach(({ id }) => {
        const section = document.getElementById(id)
        if (!section) return
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActive(id),
        })
      })
    },
    { dependencies: [isHome] },
  )

  /* ── 4. Indicateur qui glisse sous le lien actif ────────────────────── */
  const placeIndicator = useCallback((animate = true) => {
    const link = navRef.current?.querySelector(`[data-id="${active}"]`)
    const indicator = indicatorRef.current
    if (!link || !indicator) return
    gsap.to(indicator, {
      x: link.offsetLeft,
      width: link.offsetWidth,
      autoAlpha: isHome ? 1 : 0,
      duration: animate && !prefersReducedMotion() ? 0.55 : 0,
      ease: MOTION.ease.out,
      overwrite: 'auto',
    })
  }, [active, isHome])

  useEffect(() => {
    placeIndicator(true)
  }, [placeIndicator])

  useEffect(() => {
    // re-mesure quand les polices finissent de charger et au redimensionnement
    document.fonts?.ready.then(() => placeIndicator(false))
    const onResize = () => placeIndicator(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [placeIndicator])

  /* ── 5. Menu mobile ──────────────────────────────────────────────────── */
  const { contextSafe } = useGSAP({ scope: headerRef })

  const setMenu = contextSafe((next) => {
    if (next === openRef.current) return
    openRef.current = next
    setOpen(next)
    const main = document.getElementById('main')

    if (next) {
      // Le cercle part du centre du bouton : mesuré à chaque ouverture (robuste au resize)
      const r = burgerRef.current.getBoundingClientRect()
      const at = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`
      const menu = menuRef.current
      const lines = burgerRef.current.querySelectorAll('[data-line]')

      menuTl.current?.kill()
      const tl = gsap.timeline({ defaults: { ease: MOTION.ease.out } })
      tl.set(menu, { visibility: 'visible' })
        .fromTo(menu, { clipPath: `circle(0% at ${at})` }, { clipPath: `circle(150% at ${at})`, duration: 0.9, ease: MOTION.ease.inOut })
        .to(lines[0], { y: 4, rotate: 45, duration: 0.4 }, 0)
        .to(lines[1], { y: -4, rotate: -45, duration: 0.4 }, 0)
        .fromTo(menu.querySelectorAll('[data-menu-item]'), { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.06 }, '-=0.45')
        .fromTo(menu.querySelectorAll('[data-menu-meta]'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, '-=0.45')
      if (prefersReducedMotion()) tl.timeScale(40)
      menuTl.current = tl

      lockScroll(true)
      main?.setAttribute('inert', '')
      gsap.delayedCall(prefersReducedMotion() ? 0 : 0.45, () => menu.querySelector('a')?.focus())
    } else {
      menuTl.current?.timeScale(prefersReducedMotion() ? 40 : 1.6).reverse()
      lockScroll(false)
      main?.removeAttribute('inert')
      if (menuRef.current?.contains(document.activeElement)) burgerRef.current?.focus()
    }
  })

  // Échap + piège à focus pendant l'ouverture
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') return setMenu(false)
      if (e.key !== 'Tab') return
      const focusables = [burgerRef.current, ...menuRef.current.querySelectorAll('a')]
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setMenu])

  // Passage en desktop avec le menu ouvert → on le ferme
  useEffect(() => {
    if (isDesktop && openRef.current) setMenu(false)
  }, [isDesktop, setMenu])

  /* ── 6. Clic sur un lien de section ─────────────────────────────────── */
  const goTo = (id) => (e) => {
    e.preventDefault()
    if (openRef.current) setMenu(false)
    if (isHome) scrollToTarget(`#${id}`)
    else navigate(`/#${id}`)
  }

  return (
    <header ref={headerRef} className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-4 sm:pt-5">
      <div ref={barRef} className="container-x relative z-[60] flex items-center justify-between gap-4 *:pointer-events-auto">
        {/* Logo */}
        <Link
          to="/"
          data-nav-item
          data-intro
          onClick={(e) => {
            if (isHome) {
              e.preventDefault()
              scrollToTarget('#accueil')
            }
          }}
          className="relative z-10 flex items-center gap-3 rounded-full"
          aria-label={`${SITE.name} — accueil`}
        >
          <span className="grid size-10 place-items-center rounded-full border border-line bg-surface/70 font-display text-sm font-bold backdrop-blur-md">
            <span className="text-gradient">YS</span>
          </span>
          <span className="hidden font-display text-sm font-medium tracking-tight text-text sm:block">
            {SITE.name}
          </span>
        </Link>

        {/* Navigation desktop en pills */}
        <nav aria-label="Navigation principale" className="hidden lg:block" data-nav-item data-intro>
          <ul
            ref={navRef}
            className={`relative flex items-center gap-1 rounded-full border bg-surface/60 p-1.5 backdrop-blur-md transition-[border-color,box-shadow] duration-500 ${
              scrolled ? 'glow-cyan border-cyan/30' : 'border-line'
            }`}
          >
            {/* Indicateur de section active */}
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-cyan/10 ring-1 ring-cyan/40"
              style={{ width: 0, opacity: 0 }}
            />
            {NAV_LINKS.map(({ id, label }) => {
              const current = isHome && active === id
              return (
                <li key={id} className="relative">
                  <a
                    href={`/#${id}`}
                    data-id={id}
                    onClick={goTo(id)}
                    aria-current={current ? 'location' : undefined}
                    className={`block rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                      current ? 'text-cyan' : 'text-muted hover:text-text'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/* CTA compact (tablette / desktop) */}
          <a
            href="/#contact"
            onClick={goTo('contact')}
            data-nav-item
            data-intro
            className="btn-shine bg-gradient-neon hidden rounded-full px-5 py-2.5 text-sm font-medium text-ink md:inline-flex"
          >
            Travaillons ensemble
          </a>

          {/* Bouton hamburger (mobile / tablette) */}
          <button
            ref={burgerRef}
            type="button"
            data-nav-item
            data-intro
            onClick={() => setMenu(!openRef.current)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="relative grid size-11 place-items-center rounded-full border border-line bg-surface/70 backdrop-blur-md lg:hidden"
          >
            <span className="flex flex-col gap-[6px]" aria-hidden="true">
              <span data-line className="block h-[2px] w-5 rounded-full bg-text" />
              <span data-line className="block h-[2px] w-5 rounded-full bg-text" />
            </span>
          </button>
        </div>
      </div>

      {/* Menu mobile plein écran */}
      <div
        ref={menuRef}
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="pointer-events-auto invisible fixed inset-0 z-[55] flex flex-col justify-between bg-ink/95 px-4 pt-28 pb-10 backdrop-blur-xl sm:px-8 lg:hidden"
      >
        <nav aria-label="Navigation mobile">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ id, label }, i) => (
              <li key={id} className="overflow-clip">
                <a
                  href={`/#${id}`}
                  onClick={goTo(id)}
                  data-menu-item
                  className="group flex items-baseline gap-4 py-1.5 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-tight font-semibold tracking-tight text-text"
                >
                  <span className="font-mono text-xs text-cyan">{String(i + 1).padStart(2, '0')}</span>
                  <span className="transition-colors duration-300 group-hover:text-cyan">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4 text-sm">
          <p data-menu-meta className="flex items-center gap-2 text-muted">
            <span className="size-2 rounded-full bg-cyan shadow-[0_0_10px_#00f7ff]" />
            {SITE.availability}
          </p>
          <a data-menu-meta href={`mailto:${SITE.email}`} className="text-text underline-offset-4 hover:underline">
            {SITE.email}
          </a>
          <ul data-menu-meta className="flex gap-5">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-cyan">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
