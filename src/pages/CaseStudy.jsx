import { useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import Button from '../components/ui/Button'
import { Mockup } from '../components/ProjectCard'
import { useReveal } from '../hooks/useReveal'
import { PROJECTS } from '../constants/projects'

/**
 * Étude de cas — /projets/:slug
 * Grand mockup CSS (pas de captures brutes), meta badges, stack, défis techniques,
 * CTA live/GitHub, navigation précédent/suivant dans l'ordre de PROJECTS.
 */

function MetaBadge({ label, value, accent }) {
  if (!value) return null
  return (
    <span className="rounded-full border border-line bg-surface/40 px-3.5 py-1.5 font-mono text-xs text-muted">
      <span className="text-[10px] uppercase tracking-wider" style={{ color: accent }}>
        {label}
      </span>{' '}
      {value}
    </span>
  )
}

export function Component() {
  const { slug } = useParams()
  const index = PROJECTS.findIndex((p) => p.slug === slug)
  const contentRef = useRef(null)
  const mockupRef = useRef(null)

  useReveal(mockupRef, 'scaleIn', { scale: 0.95, y: 24 })
  useReveal(contentRef, 'fade', { targets: '[data-cs]', y: 20, stagger: 0.08 })

  if (index === -1) return <Navigate to="/404" replace />

  const p = PROJECTS[index]
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]
  const next = PROJECTS[(index + 1) % PROJECTS.length]

  return (
    <>
      <Seo title={p.title} description={p.description} path={`/projets/${p.slug}`} />

      <article className="container-x pt-32 pb-24 sm:pt-40">
        {/* Retour */}
        <Link
          to="/projets"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-cyan"
        >
          ← Tous les projets
        </Link>

        {/* En-tête */}
        <header className="mt-8">
          <p className="eyebrow">
            <span className="text-cyan">{String(index + 1).padStart(2, '0')}</span> — {p.category}
            {p.year && ` · ${p.year}`}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] font-semibold tracking-tight text-text">
            {p.title}
          </h1>
          {p.subtitle && <p className="mt-3 font-mono text-sm text-cyan/90">{p.subtitle}</p>}

          <div className="mt-6 flex flex-wrap gap-2.5">
            {p.statusLabel && (
              <span
                className="rounded-full border px-3.5 py-1.5 font-mono text-xs"
                style={{ borderColor: `${p.accentColor}66`, color: p.accentColor }}
              >
                {p.statusLabel}
              </span>
            )}
            <MetaBadge label="Rôle" value={p.role} accent={p.accentColor} />
            <MetaBadge label="Catégorie" value={p.category} accent={p.accentColor} />
            <MetaBadge label="Année" value={p.year} accent={p.accentColor} />
          </div>
        </header>

        {/* Grand mockup */}
        <div
          ref={mockupRef}
          className="mt-12 grid place-items-center rounded-3xl border border-line bg-surface/30 px-6 py-12 sm:py-16"
        >
          <Mockup project={p} large />
        </div>

        {/* Contenu */}
        <div ref={contentRef} className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div>
            <h2 data-cs className="font-display text-xl font-semibold text-text">
              À propos du projet
            </h2>
            <p data-cs className="mt-4 leading-relaxed text-muted">
              {p.description}
            </p>

            <h2 data-cs className="mt-10 font-display text-xl font-semibold text-text">
              Défis techniques
            </h2>
            <ul data-cs className="mt-4 space-y-3">
              {p.challenges.map((c) => (
                <li key={c.slice(0, 32)} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full"
                    style={{ background: p.accentColor, boxShadow: `0 0 8px ${p.accentColor}` }}
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <aside data-cs className="lg:sticky lg:top-32 self-start rounded-3xl border border-line bg-surface/40 p-6">
            <h3 className="eyebrow">Stack</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              {p.live && (
                <Button href={p.live} target="_blank" rel="noopener noreferrer" arrow>
                  Voir le site live
                </Button>
              )}
              {p.github && (
                <Button href={p.github} variant="ghost" target="_blank" rel="noopener noreferrer">
                  Voir sur GitHub
                </Button>
              )}
              {!p.live && !p.github && (
                <p className="font-mono text-xs text-muted">Démo non publique — sur demande.</p>
              )}
            </div>
          </aside>
        </div>

        {/* Précédent / Suivant */}
        <nav aria-label="Navigation entre projets" className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
          <Link
            to={prev.link}
            className="group rounded-2xl border border-line bg-surface/30 p-5 transition-colors hover:border-cyan/40"
          >
            <span className="eyebrow">← Projet précédent</span>
            <span className="mt-2 block font-display text-lg font-semibold text-text transition-colors group-hover:text-cyan">
              {prev.title}
            </span>
          </Link>
          <Link
            to={next.link}
            className="group rounded-2xl border border-line bg-surface/30 p-5 text-right transition-colors hover:border-cyan/40"
          >
            <span className="eyebrow">Projet suivant →</span>
            <span className="mt-2 block font-display text-lg font-semibold text-text transition-colors group-hover:text-cyan">
              {next.title}
            </span>
          </Link>
        </nav>
      </article>
    </>
  )
}
