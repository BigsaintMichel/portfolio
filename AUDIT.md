# Audit du portfolio — branche `p-audit-portfolio` (lecture seule)

**Date :** 2026-11-11 · **Cible :** https://portfolio-kappa-ochre-heyiw3k96o.vercel.app/
**Méthode :** requêtes HTTP réelles sur la prod, revue du code source local, analyse des assets `dist/`. Pas de navigateur disponible dans l'environnement : Lighthouse et le rendu visuel responsive sont évalués à partir des poids mesurés et de l'analyse du code (limites signalées par section).

---

## 1. Exactitude du contenu

| Affirmation | Verdict | Détail |
|---|---|---|
| « 10 projets livrés » | ⚠️ **Contradiction interne** | EduSave porte le badge « Concept · Projet privé » sur la même page — un concept n'est pas un projet « livré ». Le compteur gonfle le chiffre. |
| « 3 apps en production » | ⚠️ **Invérifiable / incohérent** | Non nommées, et le décompte réel ne colle pas : 9 liens live sont listés dans `projects.js` (dont 1 mort — cf. §7). « 3 » n'a pas de définition visible. |
| « 6 domaines de stack » | ❌ **Factuellement faux** | `SKILLS` ne contient que **4 catégories** (Frontend, Backend, Bases de données, Expertise différenciante). Le compteur affiche « 6 » — à corriger. |
| « Réponse en 24h » | ⚠️ Invérifiable | Formulation de promesse commerciale (cf. §3). |
| Formation `2026 · 2027` | ✅ Cohérent | Année préparatoire, statut « En cours » — aucune contradiction (plus de mention « Master »). |
| Némésis « Évolutif » | ✅ | Badge honnête pour un produit live qui évolue. |

## 2. Page `/projets/nemesis`

✅ **Aucune mention obsolète détectée.** Vérifié en prod : aucune occurrence de « cascade de 5 LLM », « Cerebras », « Groq », « Mistral », « 5 agents », « 8 jours » ou « 86 commits ». La page reflète la version actuelle (OpenRouter/LiteLLM, CrewAI, Typst, Telegram, PWA, dashboard coûts). Le bouton « Tester l'application » pointe bien vers `https://nemesis-ia-lac.vercel.app/`.

## 3. Crédibilité

Signaux « junior » repérés :

- ❌ **Barres de compétences en pourcentage** (HTML5 95 %, CSS3 90 %…) — l'écueil classique des portfolios juniors : 95 % de quoi, mesuré comment ? Un architecte présente ses stacks comme des faits (projets, années), pas des jauges auto-attribuées.
- ⚠️ **« Réponse en 24h »** — phrasing de place de marché freelance, étrange pour un poste d'architecte.
- ⚠️ **Tension de positionnement** : titre « Architecte Logiciel & IA » alors que la formation indique « année préparatoire en cours » — légitime vu l'expérience, mais le premier paragraphe de bio aide déjà à l'assumer (« Architecte logiciel, en parcours IA… »). À garder ainsi.
- ✅ Rien d'inventé dans les études de cas (les défis listés sont des faits vérifiables).

## 4. Performance mobile

Mesures réelles sur la prod (poids bruts, avant compression) :

| Ressource | Poids | Chargement |
|---|---|---|
| HTML `/` | 62 Ko | immédiat (SSG) |
| `app.js` + `Home.js` | 164 Ko | upfront |
| `gsap.js` | 122 Ko | **upfront** (préchargé) |
| CSS | 70 Ko | upfront |
| `three.js` | **1 154 Ko (~320 Ko gzip)** | lazy, pendant le préloader |
| `photo.png` | **2 413 Ko** | à l'entrée de la section À propos |
| Fonts | ~110 Ko (2 préchargées) | upfront |

- **Poids total potentiel : ~4 Mo** dont ~3,5 Mo de three.js + photo. Sur 4G lente et milieu de gamme : le préloader masque une partie, mais l'appareil télécharge 1,1 Mo de Three.js pour un ornement et 2,4 Mo pour UNE photo.
- ❌ `photo.png` non optimisée (PNG 2,4 Mo → un WebP/AVIF ~150 Ko suffirait).
- ⚠️ GSAP chargé upfront alors que le préloader en a besoin — justifiable, mais 122 Ko restent sur le chemin critique.
- **Verdict recruteur sur téléphone milieu de gamme :** utilisable (SSG, contenu lisible sans JS) mais le premier affichage utile est retardé par la 3D ; la photo aggrave le scroll. Lighthouse réel non exécutable ici — à rejouer dans Chrome DevTools (mobile, 4G).

## 5. Responsive (analyse code, pas de rendu réel)

- ✅ Mobile : `grid-cols-1` partout, typographies en `clamp()`, bento désactivé sous `md:`.
- ✅ Mockup CaseStudy mobile : `max-w-md` + `aspect-[9/19]` → ~227 px de large sur 360 px, rentre dans le viewport.
- ⚠️ Point de vigilance à 360 px : le mockup de page détail fait `h-[480px]` — très haut pour un petit écran (occupe ~60 % du premier viewport après l'en-tête).
- ⚠️ Navbar en pills à `fixed` : avec 6 liens, vérifier à 360 px qu'ils ne wrap pas hors écran (non testable sans navigateur).
- 768/1440 : le layout desktop est le plus éprouvé (bento 8/4, grille 12) — pas de risque évident.

## 6. Partage et référencement

| Élément | État |
|---|---|
| `<title>` + meta description | ✅ présents |
| Open Graph (type, title, description, url, image 1200×630, locale fr_FR) | ✅ complet, `og-image.png` sert 200 (32 Ko) |
| Twitter Card `summary_large_image` | ✅ avec image |
| Canonical | ✅ |
| `lang="fr"` | ✅ |
| Favicon | ✅ `favicon.svg` sert 200 |
| sitemap.xml + robots.txt | ✅ 12 URLs déclarées |
| **JSON-LD / données structurées** | ❌ **absentes** — aucun `application/ld+json`. Un schéma `Person` (nom, titre, sameAs GitHub/LinkedIn) renforcerait le knowledge panel. |
| `og:image:alt` | ⚠️ absent (mineur) |

L'aperçu LinkedIn/WhatsApp fonctionnera : image OG valide et accessible.

## 7. Liens et formulaire

| Lien | HTTP | Verdict |
|---|---|---|
| GitHub | 200 | ✅ |
| LinkedIn | 999 | ✅ probable — anti-bot LinkedIn, normal pour un crawler |
| WhatsApp | 200 | ✅ |
| CV `YRIGALE.pdf` | 200 (596 Ko) | ✅ |
| Némésis | 200 | ✅ |
| TraceLot | 200 | ✅ |
| Naturalink | 200 | ✅ |
| FEES | 200 | ✅ |
| CATREPS | 406 → 200 (UA navigateur) | ⚠️ fonctionne mais anti-bot agressif |
| **ManageX** `ya-consulting.com/managex` | **302 → `suspendedpage.cgi` → 403** | ❌ **LIEN MORT — compte hébergement suspendu**. La carte présente un projet « en production » qui ne l'est plus. |
| Cabinet J. Rapha | 200 | ✅ |
| JMS Afrique | 200 | ✅ |
| JECPSSM | 200 | ✅ |
| Formulaire Formspree | POST → 400 (payload vide = endpoint vivant) | ✅ actif en prod, envoie vers `saintmichelyirigale@gmail.com` via `xgaodlnv` |

## 8. Accessibilité

- ✅ `prefers-reduced-motion` : respecté globalement (`lib/motion.js` + tous les effets, scène 3D figée).
- ✅ `alt` sur toutes les images, `aria-label` sur les icônes sociales, labels associés aux champs du formulaire.
- ✅ `scroll-mt-*` : les ancres atterrissent sous la navbar fixe.
- ⚠️ Contrastes : texte `#9a9ab0` sur `#0a0a1a` correct (~7:1) ; les chips `text-[10px]` en `accentColor` sur fond sombre sont petites mais lisibles.
- ⚠️ Clavier : liens natifs (focusables) ; **style `:focus-visible` non vérifié** visuellement — à contrôler.
- ⚠️ Le compteur animé affiche « 0 » sans JS jusqu'à l'animation (contenu injecté en `data-count-to`) — le HTML SSR contient-il la valeur finale ? À vérifier pour les lecteurs d'écran.

## 9. Technique

- ❌ `photo.png` 2,4 Mo non optimisée (cf. §4).
- ⚠️ `vite-react-ssg` listé dans `dependencies` au lieu de `devDependencies`.
- ⚠️ ~100 Ko de pages HTML/CSS/JS legacy dans `public/` : déployées mais jamais servies (les redirections 301 passent avant le filesystem) — poids mort inoffensif.
- ✅ Toutes les dépendances sont utilisées (gsap, lenis, three, formspree, fontsource).
- ✅ Pas de secret commité (`.env` ignoré), `dist/` ignoré.
- Console navigateur : non mesurable ici — point de vigilance connu : le `Preloader` et l'hydratation SSR devraient être propres, à confirmer dans DevTools.

---

## Priorisation (pour un futur lot de correctifs)

| # | Action | Impact |
|---|---|---|
| P0 | Retirer/corriger le lien **ManageX** (site suspendu) | un lien mort sur « en production » décrédibilise tout |
| P0 | `photo.png` → WebP ~200 Ko | −2,2 Mo sur mobile |
| P1 | « 6 domaines de stack » → **4** (ou reformuler) | exactitude factuelle |
| P1 | « 10 projets livrés » → reformuler (ex. « 9 en production + 1 concept ») | cohérence avec le badge EduSave |
| P1 | Supprimer ou remplacer les **jauges %** par des preuves (années, projets) | crédibilité architecte |
| P2 | Ajouter JSON-LD `Person` | SEO/rich results |
| P2 | Envisager un repli poster/statique de la scène 3D sur mobile | −1,1 Mo pour les téléphones |
