# Portfolio — Yrigalé Saint Michel

Portfolio professionnel (Architecte Logiciel & IA appliquée à l'industrie) : React 19, Vite, Tailwind CSS v4, GSAP, Three.js (R3F), Lenis, pré-rendu statique avec `vite-react-ssg`.

---

## Installation

Prérequis : Node 20+ (testé avec Node 22).

```bash
npm install
npm run dev       # serveur de dev (avec rendu serveur, comme en prod)
npm run build     # sitemap + build + pré-rendu HTML de chaque route dans dist/
npm run preview   # sert dist/ sur http://localhost:4173
```

### Variables d'environnement

Copier `.env.example` en `.env` et compléter :

| Variable | Rôle | Requis |
|---|---|---|
| `VITE_SITE_URL` | URL canonique (canonical / Open Graph / sitemap). Par défaut : `https://portfolio-kappa-ochre-heyiw3k96o.vercel.app` | si domaine custom |
| `VITE_FORMSPREE_ID` | ID du formulaire Formspree (ex. `xyzabcd` dans `https://formspree.io/f/xyzabcd`) | **oui** pour le formulaire de contact |

Sans `VITE_FORMSPREE_ID`, la section Contact affiche un fallback `mailto:` — aucun crash.

---

## Stack

| Paquet | Version | Note |
|---|---|---|
| react / react-dom | 19 | exigé par R3F v9 |
| vite-react-ssg | 0.9 | pré-rendu statique (12 pages HTML) |
| react-router-dom | 6.30 | imposé par vite-react-ssg |
| vite / tailwindcss | 7 / 4 | tokens dans `@theme` (`src/styles/index.css`) |
| gsap | 3.15 | SplitText / ScrollTrigger (gratuits depuis 3.13) |
| @react-three/fiber · drei | 9 · 10 | scène 3D du Hero (lazy) |
| lenis | 1.3 | smooth scroll synchronisé au ticker GSAP |
| @formspree/react | 3 | formulaire de contact |

---

## Arborescence

```
src/
├─ main.jsx               point d'entrée vite-react-ssg
├─ routes.jsx             routes (lazy → code splitting) + getStaticPaths
├─ lib/                   gsap.js · lenis.js · motion.js
├─ effects/               fade · revealChars · revealLines · clipReveal · scaleIn · counter
├─ hooks/                 useReveal.js · useMediaQuery.js
├─ context/IntroContext.jsx
├─ constants/             site.js · content.js · projects.js (source unique des 10 projets)
├─ components/
│  ├─ layout/             Layout · Navbar · Preloader · Seo
│  ├─ ui/                 Button · Typewriter · SectionTitle
│  ├─ three/              HeroScene · CoreModel · ParticleField
│  └─ ProjectCard.jsx     carte + Mockup CSS (navigateur/smartphone)
├─ sections/Hero.jsx
├─ pages/                 Home · ProjectsIndex · CaseStudy · NotFound
└─ styles/index.css       design system (tokens néon cyan/magenta)
public/                   images · cv/YRIGALE.pdf · pages legacy · sitemap.xml · robots.txt
vercel.json               redirections 301 + config build
scripts/generate-sitemap.js
```

---

## Déploiement sur Vercel — guide pas à pas

### Étape 1 — Pousser sur GitHub

```bash
cd portfolio_V2
git init                    # si pas déjà un repo
git add .
git commit -m "Portfolio v2 — React/Vite + SSG"
git branch -M main
git remote add origin https://github.com/BigsaintMichel/<nom-du-repo>.git
git push -u origin main
```

> `.env` n'est jamais commité (déjà ignoré). Seul `.env.example` monte sur GitHub.

### Étape 2 — Importer dans Vercel

1. [vercel.com](https://vercel.com) → **Add New… → Project** → importer le repo GitHub.
2. **Framework Preset : `Vite`** (détecté automatiquement).
3. Laisser les réglages par défaut — `vercel.json` impose déjà :
   - Build Command : `npm run build` (génère le sitemap puis le SSG)
   - Output Directory : `dist`
4. **Environment Variables** → ajouter :
   - `VITE_FORMSPREE_ID` = l'ID du formulaire (Formspree → *Forms → Integration*, la partie après `f/`).
   - `VITE_SITE_URL` = uniquement si un domaine personnalisé remplace l'URL `*.vercel.app` par défaut.
5. **Deploy**.

### Étape 3 — Vérifier les redirections 301 (ancien → nouveau)

`vercel.json` redirige les anciennes URLs `.html` vers les routes React :

| Ancienne URL | → | Nouvelle |
|---|---|---|
| `/index.html` | → | `/` |
| `/projects.html` | → | `/projets` |
| `/tracelot.html`, `/naturalink.html`, `/fees.html`, `/catreps.html`, `/managex.html`, `/edusave.html`, `/cabinet-jehovah-rapha.html`, `/jms-afrique.html`, `/jecpssm.html` | → | `/projets/<slug>` |
| `/lystore.html`, `/garaf.html` | → | `/projets` (projets retirés) |

**Test après déploiement** :

```bash
curl -sI https://<ton-url>.vercel.app/tracelot.html | findstr /i "HTTP location"
# attendu : HTTP/2 301 + location: /projets/tracelot
```

### Étape 4 — Checklist post-déploiement

- [ ] `/` charge (préloader → hero animé, scène 3D à droite)
- [ ] `/projets` et chaque `/projets/<slug>` (10 pages) s'ouvrent
- [ ] Formulaire Contact envoie bien vers Formspree (tester avec un vrai message)
- [ ] `/cv/YRIGALE.pdf` télécharge le CV
- [ ] `/sitemap.xml` et `/robots.txt` répondent
- [ ] **Lien Némésis** : la carte et la page `/projets/nemesis` pointent vers `https://nemesis-ia-lac.vercel.app/` — vérifier que la démo est accessible (badge « Sur invitation »)
- [ ] Les redirections 301 ci-dessus fonctionnent

### Formulaire Formspree — création

1. Compte sur [formspree.io](https://formspree.io) → **New Form** → récupérer l'ID (`xyzabcd` dans `https://formspree.io/f/xyzabcd`).
2. Le mettre dans `VITE_FORMSPREE_ID` (Vercel → Settings → Environment Variables → Redeploy).
3. États gérés : envoi (`Envoi en cours…`), succès (écran de confirmation), erreurs de champ (`ValidationError`) et erreur globale.

---

## Notes techniques

- **SSG** : 12 pages HTML pré-rendues (`/`, `/projets`, 10 études de cas) — title/meta/OG lisibles sans JS.
- **SEO** : `sitemap.xml` régénéré à chaque build depuis `constants/projects.js` ; `robots.txt` ; canonical via `VITE_SITE_URL`.
- **Perf** : Three.js en lazy (chunk séparé), polices auto-hébergées (fontsource), préchargements réduits (`trimPreloads`).
- **Accessibilité** : `prefers-reduced-motion` respecté partout (reveals, scène 3D figée, compteurs), `scroll-mt` sous la navbar fixe, labels de formulaire associés.
- **Mockups CSS** : pas de captures brutes — cadres navigateur/smartphone générés, logos en `object-contain`, fallback initiale colorée.

---

## Reste à fournir (contenu)

- [ ] `public/images/projects/nemesis.webp` — visuel Némésis (fallback « N » rose en attendant)
- [ ] Image Open Graph 1200×630 → `public/images/og-image.png`
- [ ] `VITE_FORMSPREE_ID` (formulaire de contact)
- [ ] Domaine personnalisé (optionnel → `VITE_SITE_URL`)
