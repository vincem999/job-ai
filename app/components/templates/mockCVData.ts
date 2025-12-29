// Mock CV data for testing the CVTemplate component

export const mockCVData = {
  id: "Master CV",
  personalInfo: {
    firstName: "Vincent",
    lastName: "MONNEGER",
    title: "Développeur Front-end Vue.js",
    email: "vincentmonneger@gmail.com",
    phone: "06 51 89 31 49",
    location: "78430 Louveciennes ",
    linkedin: "https://linkedin.com/in/vincent-monneger",
    github: "https://github.com/vincem999",
    photo: "/profile.jpg",
  },
  summary:
    "Développeur front-end spécialisé Vue.js, avec un fort esprit d'initiative et une curiosité naturelle. Polyvalent, je possède également des compétences en backend, DevOps et cloud, ce qui me permet de contribuer efficacement à différents aspects du développement applicatif.",
  workExperiences: [
    {
      id: "exp-1",
      title: "Développeur Full Stack",
      company: "Vincent Monneger (Freelance)",
      location: "Paris, France",
      startDate: "10/2025",
      endDate: "Present",
      description:
        "Création d'un SaaS (en cours) avec l'API Open AI. Mettre à disposition le deep research",
      bullets: [
        "Utilisation de Claude Code avec context engineering pour le développement",
        "Backend Node.js/Express avec architecture microservices",
        "Cache & Queue : Redis + BullMQ pour traitement asynchrone",
        "Déploiement sur Railway (backend) et Vercel (frontend)",
      ],
      skills: [
        "Node.js",
        "Express",
        "Redis",
        "BullMQ",
        "Supabase",
        "Nuxt 4",
        "OpenAI API",
      ],
    },
    {
      id: "exp-2",
      title: "Développeur web",
      company: "Vincent Monneger (Freelance)",
      location: "Paris, France",
      startDate: "11/2024",
      endDate: "Present",
      description:
        "Création site Webflow avec du custom code et autres projets avec technologies modernes",
      bullets: [
        "Création du site https://www.re-nesens.com avec Webflow",
        "Développement de projets avec Astro.js",
        "Intégration d'animations GSAP",
        "Développement WordPress personnalisé",
      ],
      skills: ["Webflow", "Astro.js", "GSAP", "WordPress", "JavaScript"],
    },
    {
      id: "exp-3",
      title: "Développeur front",
      company: "Jobpass",
      location: "Paris, France",
      startDate: "10/2021",
      endDate: "09/2024",
      description:
        "Arrivé à la création de l'entreprise, développement complet de l'application frontend",
      bullets: [
        "Développement de l'application en Vue 2, puis migration vers Vue 3 avec Typescript",
        "Passage de VueX à Pinia pour le state management",
        "Configuration du framework Quasar et personnalisation des composants",
        "Intégration de GraphQL avec le client Apollo pour les requêtes API",
        "Mise en place de l'authentification via Firebase, puis migration vers Auth0",
        "Réalisation de tests automatisés avec Cypress pour garantir la qualité du code",
      ],
      skills: [
        "Vue.js",
        "TypeScript",
        "Pinia",
        "Quasar",
        "GraphQL",
        "Apollo",
        "Cypress",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor Développeur Web",
      institution: "Hetic",
      year: "2021-2023",
      description:
        "Formation complète en développement web avec spécialisation frontend et backend : React, Svelte, PHP, Symfony, Golang, Node.js, Docker, Cloud, CI/CD, Accessibilité web",
    },
    {
      id: "edu-2",
      degree: "Développeur web junior RNCP niveau 5 (BAC +2)",
      institution: "OpenClassrooms",
      year: "2020-2021",
      description:
        "Formation en développement web : HTML, CSS, JavaScript, Vue.js, Node.js, Express, MongoDB, Accessibilité web",
    },
  ],
  skills: {
    technical: [
      "Vue.js",
      "React",
      "Svelte",
      "TypeScript",
      "Nuxt.js",
      "Node.js",
      "GraphQL",
      "Docker",
      "Cloud",
      "Cypress",
      "Playwright",
      "Storybook",
    ],
    languages: ["Anglais (B2)"],
    soft: [
      "Initiative",
      "Curiosité",
      "Polyvalence",
      "Adaptabilité",
      "Collaboration",
      "Résolution de problèmes",
      "Innovation",
      "Autonomie",
    ],
  },
  certifications: [],
  projects: [
    {
      id: "proj-1",
      name: "SaaS Deep Research",
      description:
        "Création d'un SaaS utilisant l'API OpenAI pour fournir des services de deep research avec architecture microservices.",
      technologies: [
        "Node.js",
        "Express",
        "Redis",
        "BullMQ",
        "Supabase",
        "Nuxt 4",
        "OpenAI API",
      ],
      date: "2025",
    },
    {
      id: "proj-2",
      name: "Re-Nesens Website",
      description:
        "Site web moderne créé avec Webflow et du code personnalisé, intégrant des animations et un design responsive.",
      technologies: ["Webflow", "JavaScript", "Custom Code"],
      url: "https://www.re-nesens.com",
      date: "2024",
    },
    {
      id: "proj-3",
      name: "Jobpass Application",
      description:
        "Application de gestion de candidatures développée from scratch avec Vue.js, migration complète de Vue 2 vers Vue 3.",
      technologies: [
        "Vue.js",
        "TypeScript",
        "Pinia",
        "Quasar",
        "GraphQL",
        "Apollo",
      ],
      date: "2021-2024",
    },
  ],
}

// CVData interface is defined above
