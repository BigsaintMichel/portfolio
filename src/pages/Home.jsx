import { useRef } from 'react'
import { useForm, ValidationError } from '@formspree/react'
import Seo from '../components/layout/Seo'
import Hero from '../sections/Hero'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'
import ProjectCard from '../components/ProjectCard'
import { useReveal } from '../hooks/useReveal'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { MOTION } from '../lib/motion'
import { SITE, SOCIALS } from '../constants/site'
import { ABOUT, FORMATION, SKILLS } from '../constants/content'
import { PROJECTS } from '../constants/projects'

/**
 * Page d'accueil — données migrées depuis l'ancien portfolio statique.
 * Les pages détail des projets sont servies telles quelles depuis public/*.html.
 */

function About() {
  const photoRef = useRef(null)
  const textRef = useRef(null)
  const statsRef = useRef(null)

  useReveal(photoRef, 'scaleIn', { scale: 0.9, y: 30 })
  useReveal(textRef, 'fade', { targets: '[data-about]', y: 20, stagger: 0.08 })
  useReveal(statsRef, 'fade', { targets: 'li', y: 12, stagger: 0.07, duration: 0.5 })
  useReveal(statsRef, 'counter', { targets: '[data-count-to]', duration: 1.4, stagger: 0.15 })

  return (
    <section id="a-propos" aria-labelledby="a-propos-title" className="container-x scroll-mt-24 pt-32 pb-16 sm:pb-20">
      <SectionTitle
        id="a-propos-title"
        index="02"
        eyebrow="À propos"
        title="L'ingénierie au service du terrain"
      />
      {/* Grille asymétrique 4/8 : photo portrait à gauche, texte à droite */}
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16">
        <div ref={photoRef} className="relative w-full max-w-[250px] md:col-span-4 md:max-w-none">
          <img
            src={ABOUT.photo}
            alt={SITE.name}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-2xl border border-line bg-surface object-cover"
          />
        </div>
        <div ref={textRef} className="max-w-2xl md:col-span-8">
          <h3 data-about className="font-display text-xl font-semibold text-text">{SITE.name}</h3>
          <p data-about className="text-gradient mt-1 font-display text-base font-medium">{SITE.title} appliquée à l'industrie</p>
          {ABOUT.bio.map((p) => (
            <p data-about key={p.slice(0, 24)} className="mt-4 text-base leading-relaxed text-muted">
              {p}
            </p>
          ))}
          {/* Stats : une seule ligne discrète, séparée par un filet */}
          <ul ref={statsRef} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5">
            {ABOUT.strengths.map((s) => (
              <li key={s.label} className="font-mono text-xs text-muted">
                {s.value != null ? (
                  <span data-count-to={s.value} className="mr-1.5 text-cyan tabular-nums">
                    {s.value}
                  </span>
                ) : (
                  <span aria-hidden="true" className="mr-1.5 inline-block size-1 rounded-full bg-cyan align-middle" />
                )}
                {s.label}
              </li>
            ))}
          </ul>
          <div data-about className="mt-7">
            <Button href={SITE.cv} variant="ghost" download="YRIGALE_CV.pdf">
              Télécharger mon CV
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Formation() {
  const gridRef = useRef(null)
  useReveal(gridRef, 'scaleIn', { targets: 'article', stagger: 0.12 })

  return (
    <section id="formation" aria-labelledby="formation-title" className="container-x scroll-mt-24 py-16 sm:py-20">
      <SectionTitle
        id="formation-title"
        index="03"
        eyebrow="Formation"
        title="Parcours académique"
      />
      {/* Cartes empilées, compactes, centrées — pas de vide à droite */}
      <div ref={gridRef} className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {FORMATION.map((f) => (
          <article
            key={f.degree}
            className="rounded-2xl border border-line bg-surface/40 p-5 transition-colors duration-300 hover:border-cyan/40 sm:p-6"
          >
            <div className="flex items-center gap-4">
              <img
                src={f.logo}
                alt={`Logo ${f.school}`}
                loading="lazy"
                className="size-12 shrink-0 rounded-lg bg-white/90 object-contain p-1"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-xl font-semibold leading-snug text-text">{f.degree}</h3>
                <p className="mt-1 text-sm text-cyan/90">{f.school}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] ${
                    f.status === 'En cours' ? 'border-cyan/40 text-cyan' : 'border-line text-muted'
                  }`}
                >
                  {f.status}
                </span>
                {f.period && <span className="font-mono text-[11px] text-muted">{f.period}</span>}
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{f.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Projects() {
  const gridRef = useRef(null)
  useReveal(gridRef, 'scaleIn', { targets: 'article', stagger: 0.08 })

  return (
    <section id="projets" aria-labelledby="projets-title" className="container-x scroll-mt-32 py-16 sm:py-20">
      <SectionTitle
        id="projets-title"
        index="04"
        eyebrow="Projets"
        title="Études de cas"
        intro="Dix projets : applications web complètes, mobile offline-first, traçabilité industrielle, agents IA et sites en production."
      />
      {/* Grille bento : Némésis en vedette (8), dernier projet (8), le reste en tiers */}
      <div ref={gridRef} className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-12">
        {PROJECTS.map((p, i) => (
          <div
            key={p.slug}
            className={`h-full ${i === 0 || i === PROJECTS.length - 1 ? 'md:col-span-8' : 'md:col-span-4'}`}
          >
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </section>
  )
}

function Competences() {
  const gridRef = useRef(null)
  useReveal(gridRef, 'fade', { targets: '[data-skill-cat]', y: 24, stagger: 0.1 })

  // Barres : remplissage progressif (scaleX depuis la gauche) à l'entrée dans le viewport
  useGSAP(
    () => {
      gsap.fromTo(
        '[data-skill-bar]',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: MOTION.ease.out,
          stagger: 0.05,
          scrollTrigger: { trigger: gridRef.current, start: MOTION.start },
        },
      )
    },
    { scope: gridRef },
  )

  return (
    <section id="competences" aria-labelledby="competences-title" className="container-x scroll-mt-24 py-16 sm:py-20">
      <SectionTitle
        id="competences-title"
        index="05"
        eyebrow="Compétences"
        title="Stack & expertise"
      />
      <div ref={gridRef} className="grid gap-6 md:grid-cols-2">
        {SKILLS.map((cat) => (
          <div key={cat.category} data-skill-cat className="rounded-3xl border border-line bg-surface/40 p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-text">{cat.category}</h3>
            <ul className="mt-5 space-y-4">
              {cat.items.map((s) => (
                <li key={s.name}>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm">
                    <span className="text-text">{s.name}</span>
                    <span className="font-mono text-xs text-muted">{s.level}%</span>
                  </div>
                  <div className="h-[3px] overflow-hidden rounded-full bg-line">
                    <div data-skill-bar className="bg-gradient-neon h-full rounded-full" style={{ width: `${s.level}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

const SOCIAL_ICONS = {
  GitHub: (
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.68 5.38-5.24 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  ),
  LinkedIn: (
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  ),
  WhatsApp: (
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.96L2 22l5.18-1.5A9.94 9.94 0 1 0 12.04 2Zm5.8 14.1c-.24.68-1.4 1.3-1.95 1.38-.5.07-1.13.1-1.82-.11a16.9 16.9 0 0 1-1.65-.61c-2.9-1.25-4.8-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.77-.36l.56.01c.18.01.42-.07.66.5.24.59.83 2.04.9 2.19.07.14.12.32.02.51-.09.2-.14.32-.29.5-.14.17-.3.38-.43.51-.14.14-.29.3-.13.58.17.29.75 1.23 1.6 2 1.1.98 2.03 1.28 2.32 1.43.29.14.46.12.63-.07.17-.2.72-.85.92-1.14.19-.29.39-.24.65-.14.27.09 1.7.8 1.99.95.29.14.48.22.56.34.07.12.07.68-.17 1.36Z" />
  ),
  Email: (
    <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.62-.5L12 11.27 19.38 5H4.62ZM20 6.72l-7.53 6.37a1 1 0 0 1-1.28 0L4 6.99V18.5c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5V6.72Z" />
  ),
}

function SocialButton({ label, href }) {
  const isMail = label === 'Email'
  return (
    <a
      href={href}
      target={isMail ? undefined : '_blank'}
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.03] text-muted backdrop-blur-sm transition-[border-color,color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-cyan/50 hover:text-cyan hover:shadow-[0_0_20px_-4px_rgb(0_247_255/0.5)]"
    >
      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
        {SOCIAL_ICONS[label]}
      </svg>
    </a>
  )
}

function Contact() {
  const panelsRef = useRef(null)
  useReveal(panelsRef, 'scaleIn', { targets: '[data-contact-panel]', stagger: 0.15 })

  return (
    <section id="contact" aria-labelledby="contact-title" className="container-x scroll-mt-24 py-16 sm:py-20">
      <SectionTitle
        id="contact-title"
        index="06"
        eyebrow="Contact"
        title="Travaillons ensemble"
        intro="N'hésitez pas à me contacter pour toute opportunité ou collaboration."
      />
      <div ref={panelsRef} className="grid gap-6 lg:grid-cols-2">
        <div data-contact-panel className="rounded-3xl border border-line bg-surface/40 p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold text-text">Restons en contact</h3>
          <ul className="mt-6 space-y-5 text-sm">
            <li>
              <p className="eyebrow mb-1">Email</p>
              <a href={`mailto:${SITE.email}`} className="text-text underline-offset-4 transition-colors hover:text-cyan hover:underline">
                {SITE.email}
              </a>
            </li>
            <li>
              <p className="eyebrow mb-1">Téléphone</p>
              <a href={`tel:${SITE.phone}`} className="text-text underline-offset-4 transition-colors hover:text-cyan hover:underline">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <p className="eyebrow mb-1">Localisation</p>
              <p className="text-text">{SITE.location}</p>
            </li>
          </ul>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-1.5 font-mono text-xs text-cyan">
            <span className="size-2 rounded-full bg-cyan shadow-[0_0_8px_#00f7ff]" aria-hidden="true" />
            Réponse en 24h
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <SocialButton label={s.label} href={s.href} />
              </li>
            ))}
          </ul>
        </div>
        <div data-contact-panel className="rounded-3xl border border-line bg-surface/40 p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID

const inputClass =
  'w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-text placeholder:text-muted/60 outline-none transition-colors focus:border-cyan/60'

function ContactForm() {
  const [state, handleSubmit] = useForm(FORMSPREE_ID || 'placeholder')

  if (!FORMSPREE_ID) {
    // Fallback : pas d'ID Formspree configuré → simple mailto
    return (
      <div className="flex h-full flex-col justify-center gap-6">
        <p className="leading-relaxed text-muted">
          Un projet web, mobile ou un système d'information industriel ? Décrivez votre besoin par
          email — je réponds sous 24h avec une première analyse.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href={`mailto:${SITE.email}`} arrow>
            Écrire un message
          </Button>
          <Button href={SITE.cv} variant="ghost" download="YRIGALE_CV.pdf">
            Télécharger mon CV
          </Button>
        </div>
      </div>
    )
  }

  if (state.succeeded) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <span className="grid size-14 place-items-center rounded-full border border-cyan/40 bg-cyan/10 text-cyan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="font-display text-lg font-semibold text-text">Message envoyé !</p>
        <p className="text-sm text-muted">Merci pour votre message — je vous réponds sous 24h.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="font-display text-xl font-semibold text-text">Envoyez-moi un message</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="eyebrow mb-1.5 block">Nom</label>
          <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder="Votre nom" className={inputClass} />
        </div>
        <div>
          <label htmlFor="contact-email" className="eyebrow mb-1.5 block">Email</label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="vous@exemple.com" className={inputClass} />
          <ValidationError field="email" prefix="Email" errors={state.errors} className="mt-1.5 font-mono text-xs text-magenta" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="eyebrow mb-1.5 block">Message</label>
        <textarea id="contact-message" name="message" required rows={5} placeholder="Décrivez votre projet ou votre besoin…" className={`${inputClass} resize-y`} />
        <ValidationError field="message" prefix="Message" errors={state.errors} className="mt-1.5 font-mono text-xs text-magenta" />
      </div>
      {(state.errors?.getFormErrors?.().length ?? 0) > 0 && (
        <p className="font-mono text-xs text-magenta">Une erreur est survenue — réessayez ou écrivez directement à {SITE.email}.</p>
      )}
      <button
        type="submit"
        disabled={state.submitting}
        className="btn-shine mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.submitting ? 'Envoi en cours…' : 'Envoyer le message →'}
      </button>
    </form>
  )
}

export function Component() {
  return (
    <>
      <Seo path="/" description={SITE.description} />
      <Hero />
      <About />
      <Formation />
      <Projects />
      <Competences />
      <Contact />
    </>
  )
}
