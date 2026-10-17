import { useRef } from 'react'
import Seo from '../components/layout/Seo'
import SectionTitle from '../components/ui/SectionTitle'
import ProjectCard from '../components/ProjectCard'
import { useReveal } from '../hooks/useReveal'
import { PROJECTS } from '../constants/projects'

/** Index /projets — grille complète des études de cas. */
export function Component() {
  const gridRef = useRef(null)
  useReveal(gridRef, 'scaleIn', { targets: 'article', stagger: 0.08 })

  return (
    <>
      <Seo
        title="Projets"
        description="Projets de Yrigalé Saint Michel : applications web et mobiles, traçabilité industrielle, agents IA et plateformes PHP en production."
        path="/projets"
      />
      <section className="container-x pt-32 pb-24 sm:pt-40">
        <SectionTitle
          index="01"
          eyebrow="Projets"
          title="Études de cas"
          intro="Dix projets : applications web complètes, mobile offline-first, traçabilité industrielle, agents IA et sites en production."
        />
        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </>
  )
}
