import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { PROJECTS } from '../src/constants/projects.js'

/**
 * Génère public/sitemap.xml à partir de constants/projects.js.
 * Lancé automatiquement avant chaque build (script "build" de package.json).
 * Domaine : VITE_SITE_URL (env Vercel/local) ou valeur par défaut — doit matcher
 * SITE.url dans constants/site.js.
 */

const BASE = (process.env.VITE_SITE_URL || 'https://portfolio-kappa-ochre-heyiw3k96o.vercel.app').replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)

const urls = [
  { loc: '/', priority: '1.0', changefreq: 'monthly' },
  { loc: '/projets', priority: '0.9', changefreq: 'monthly' },
  ...PROJECTS.map((p) => ({ loc: `/projets/${p.slug}`, priority: '0.8', changefreq: 'yearly' })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const out = join(dirname(fileURLToPath(import.meta.url)), '../public/sitemap.xml')
writeFileSync(out, xml)
console.log(`[sitemap] ${urls.length} URLs → public/sitemap.xml`)
