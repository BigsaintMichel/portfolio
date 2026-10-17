import { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * Carte projet.
 * Structure : flex-col → [conteneur image h-44 fixe] + [contenu flex-1 p-5].
 * L'image est bornée par le conteneur (overflow-hidden + max-h-full) :
 * impossible qu'elle déborde sur le titre/description.
 */
/** Visuel généré en CSS — logo/initials dans un cadre navigateur ou smartphone. */
export function Mockup({ project, large = false }) {
  const { title, image, mockup, accentColor, logoWhiteBg } = project
  const [imgError, setImgError] = useState(false)
  const screen = `radial-gradient(ellipse at 30% 20%, ${accentColor}26, transparent 65%), var(--color-surface-2)`

  const visual =
    image && !imgError ? (
      logoWhiteBg ? (
        // Logo JPG à fond blanc : boîte blanche carrée, logo entier en object-contain
        <span className={`flex items-center justify-center rounded-md bg-white shadow-sm ${large ? 'size-24 p-2' : 'size-14 p-1.5'}`}>
          <img
            src={image}
            alt={`Logo ${title}`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-contain"
          />
        </span>
      ) : (
        <img
          src={image}
          alt={`Logo ${title}`}
          loading="lazy"
          onError={() => setImgError(true)}
          className="max-h-full max-w-[80%] object-contain"
        />
      )
    ) : (
      <span
        className={`font-display font-bold ${large ? 'text-4xl' : 'text-2xl'}`}
        style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}, 0 0 48px ${accentColor}66` }}
      >
        {title.charAt(0)}
      </span>
    )

  return mockup === 'mobile' ? (
    // Cadre smartphone — hauteur relative au conteneur
    <div
      className={`shrink-0 rounded-[1.2rem] border border-line bg-ink/90 p-1.5 shadow-[0_10px_26px_-12px_rgb(0_0_0/0.8)] ${
        large ? 'h-56' : 'h-36'
      }`}
    >
      <div
        className="flex h-full w-full items-center justify-center overflow-hidden rounded-[0.85rem] p-3"
        style={{ background: screen }}
      >
        {visual}
      </div>
    </div>
  ) : (
    // Cadre navigateur (points macOS)
    <div
      className={`overflow-hidden rounded-xl border border-line bg-ink/90 shadow-[0_10px_26px_-12px_rgb(0_0_0/0.8)] ${
        large ? 'w-full max-w-2xl' : 'w-[82%]'
      }`}
    >
      <div className="flex items-center gap-1.5 border-b border-line bg-surface-2/80 px-3 py-1.5" aria-hidden="true">
        <span className="size-1.5 rounded-full bg-[#ff5f57]" />
        <span className="size-1.5 rounded-full bg-[#febc2e]" />
        <span className="size-1.5 rounded-full bg-[#28c840]" />
      </div>
      <div
        className={`flex items-center justify-center overflow-hidden p-3 ${large ? 'h-56 sm:h-72' : 'h-20'}`}
        style={{ background: screen }}
      >
        {visual}
      </div>
    </div>
  )
}

export default function ProjectCard({ project }) {
  const { title, subtitle, tags, description, link, github, statusLabel, accentColor } = project

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface/40 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-cyan/40 hover:shadow-[0_16px_50px_-20px_rgb(0_247_255/0.25)]">
      {/* Mockup — hauteur fixe identique pour tous les projets */}
      <div className="flex h-48 w-full items-center justify-center overflow-hidden border-b border-line bg-surface/30 p-4">
        <Mockup project={project} />
      </div>

      {/* Contenu — toujours sous l'image */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-snug text-text">
            <span
              aria-hidden="true"
              className="mr-2 inline-block size-2 rounded-full align-middle"
              style={{ background: accentColor }}
            />
            {title}
          </h3>
          {statusLabel && (
            <span
              className="shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] leading-none"
              style={{ borderColor: `${accentColor}66`, color: accentColor }}
            >
              {statusLabel}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 font-mono text-xs text-muted">{subtitle}</p>}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
          <Link
            to={link}
            className="text-sm font-medium text-cyan underline-offset-4 transition-colors hover:text-magenta hover:underline"
          >
            Voir le projet →
          </Link>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted underline-offset-4 transition-colors hover:text-cyan hover:underline"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
