/**
 * Contenu migré depuis l'ancien portfolio (index.html à la racine).
 * Les logos pointent vers public/images/ et les liens détail vers les pages
 * HTML legacy copiées dans public/ (servies telles quelles par Vite).
 */

export const ABOUT = {
  photo: '/images/photo.png',
  photoWebp: '/images/photo.webp',
  bio: [
    "Architecte logiciel basé en Côte d'Ivoire, spécialisé en IA appliquée à l'industrie. Je conçois des systèmes d'information industriels complets : capture terrain en mobile offline-first, supervision web, intégration blockchain et architectures cloud.",
    "Architecte logiciel, en parcours IA appliquée à l'industrie à Samara Polytech, je développe en autonomie une solution de traçabilité et de sécurisation pour lutter contre la fraude sur la biomasse (projet mené pour SODEN). Je travaille également sur Némésis, une plateforme d'orchestration d'agents IA.",
  ],
  // value → compteur animé au scroll ; sinon simple chip
  strengths: [
    { value: 9, label: 'projets en production' },
    { label: '1 concept (EduSave)' },
    { value: 4, label: 'domaines de stack' },
    { label: "IA appliquée à l'industrie" },
    { label: 'Abidjan · Remote' },
  ],
}

export const FORMATION = [
  {
    degree: "Parcours international en Intelligence Artificielle appliquée à l'industrie",
    school: 'Samara Polytech — Samara, Russie',
    period: '2026 · 2027',
    status: 'En cours',
    logo: '/images/samara-polytech/logo.svg',
    description:
      "Année préparatoire internationale à Samara Polytech, première étape d'un parcours d'ingénierie orienté IA appliquée aux procédés industriels. Objectif : compléter mon expertise d'architecte logiciel en modélisation prédictive, vision industrielle et IoT pour concevoir des systèmes industriels plus intelligents et plus fiables.",
  },
  {
    degree: 'Licence en Génie Logiciel',
    school: "HEC Abidjan — Abidjan, Côte d'Ivoire",
    period: null,
    status: 'Obtenue',
    logo: '/images/hec-abidjan/logo.png',
    description:
      "Architecture des systèmes d'information, génie logiciel, bases de données relationnelles, conception UML/MERISE et développement d'applications full-stack.",
  },
]

// Les projets ont leur propre fichier : ./projects.js

export const SKILLS = [
  {
    category: 'Frontend',
    items: [
      { name: 'React', proof: 'fronts Némésis (PWA en production) et Naturalink' },
      { name: 'Flutter / Dart', proof: 'TraceLot/BioStock, mobile offline-first' },
      { name: 'Tailwind CSS', proof: 'ce portfolio (Vite + SSG)' },
      { name: 'HTML / CSS / JavaScript', proof: 'socle de tous les sites livrés' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'FastAPI', proof: 'backend Némésis, routage multi-modèles' },
      { name: 'Node.js', proof: 'API TraceLot, synchronisation terrain' },
      { name: 'PHP / Laravel', proof: 'Naturalink, CATREPS, JMS, JECPSSM' },
      { name: 'API REST', proof: 'toutes les intégrations livrées' },
    ],
  },
  {
    category: 'Bases de données',
    items: [
      { name: 'Supabase', proof: 'auth, RLS et persistance (Némésis, TraceLot)' },
      { name: 'MySQL', proof: 'applications PHP en production' },
      { name: 'SQLite', proof: 'stockage local offline-first (TraceLot)' },
      { name: 'PostgreSQL', proof: 'via Supabase' },
    ],
  },
  {
    category: 'Expertise différenciante',
    items: [
      { name: 'OpenRouter / LiteLLM', proof: 'routage multi-modèles avec secours (Némésis)' },
      { name: 'CrewAI', proof: 'agents analyse PDF, vision, recherche web (Némésis)' },
      { name: 'Blockchain Hedera', proof: 'ancrage des lots (TraceLot)' },
      { name: 'Offline-first / Sync', proof: 'saisie sans réseau, sync différée (TraceLot)' },
      { name: 'Typst', proof: 'rapports PDF générés (Némésis)' },
      { name: 'Git / GitHub', proof: 'workflow de tous les projets' },
    ],
  },
]

export const METHOD = [
  'Conception et architecture des systèmes avant toute ligne de code.',
  'Spécification écrite des changements : ce qui change, pourquoi, comment le vérifier.',
  'Revue de code et validation avant chaque mise en production.',
  "Pilotage d'agents de code pour l'implémentation, avec revue systématique du diff.",
  'Mesure des coûts et des marges sur les produits en production.',
]
