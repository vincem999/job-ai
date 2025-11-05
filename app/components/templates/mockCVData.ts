// Mock CV data for testing the CVTemplate component

export const mockCVData = {
  personalInfo: {
    name: "Jean Dupont",
    title: "Développeur Full Stack Senior",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    linkedin: "linkedin.com/in/jeandupont",
    github: "github.com/jeandupont"
  },
  summary: "Développeur Full Stack passionné avec 8 ans d'expérience dans le développement d'applications web modernes. Expert en React, Node.js et TypeScript, avec une forte expérience en architecture microservices et DevOps. Capable de mener des projets de bout en bout, de la conception à la mise en production, avec un focus sur la qualité du code et l'expérience utilisateur.",
  experiences: [
    {
      id: "exp-1",
      title: "Lead Developer Full Stack",
      company: "TechCorp Innovation",
      location: "Paris, France",
      startDate: "2022-03",
      endDate: "Present",
      description: "Encadrement d'une équipe de 5 développeurs sur un projet de refonte complète d'une plateforme e-commerce.",
      bullets: [
        "Conception et développement d'une architecture microservices gérant 100k+ utilisateurs quotidiens",
        "Mise en place d'un pipeline CI/CD avec Docker et Kubernetes réduisant le temps de déploiement de 75%",
        "Optimisation des performances API résultant en une amélioration de 40% du temps de réponse",
        "Formation et mentorat de l'équipe sur les bonnes pratiques React et TypeScript"
      ],
      skills: ["React", "TypeScript", "Node.js", "MongoDB", "Kubernetes", "AWS"]
    },
    {
      id: "exp-2",
      title: "Développeur Full Stack",
      company: "StartupLab",
      location: "Lyon, France",
      startDate: "2019-06",
      endDate: "2022-02",
      description: "Développement d'applications web innovantes pour des clients variés dans l'écosystème startup.",
      bullets: [
        "Développement de 12 applications web from scratch avec React et Vue.js",
        "Création d'APIs REST avec Node.js et Express, gestion de bases de données PostgreSQL",
        "Intégration de solutions de paiement (Stripe, PayPal) et services tiers",
        "Collaboration étroite avec les équipes design et product pour l'UX/UI"
      ],
      skills: ["React", "Vue.js", "Node.js", "PostgreSQL", "Stripe API", "Docker"]
    },
    {
      id: "exp-3",
      title: "Développeur Frontend Junior",
      company: "Digital Agency Pro",
      location: "Marseille, France",
      startDate: "2017-09",
      endDate: "2019-05",
      description: "Premier poste en développement web, spécialisé en développement frontend moderne.",
      bullets: [
        "Développement de sites web responsive avec HTML5, CSS3 et JavaScript ES6+",
        "Création de composants réutilisables avec React et styled-components",
        "Intégration de maquettes Figma pixel-perfect",
        "Optimisation SEO et performances web (Lighthouse scores > 90)"
      ],
      skills: ["HTML5", "CSS3", "JavaScript", "React", "Sass", "Webpack"]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Master en Informatique",
      institution: "École Supérieure d'Informatique de Paris",
      year: "2017",
      description: "Spécialisation en développement web et ingénierie logicielle. Projet de fin d'études sur une application mobile React Native."
    },
    {
      id: "edu-2",
      degree: "Licence en Informatique",
      institution: "Université de Marseille",
      year: "2015",
      description: "Formation généraliste en informatique avec focus sur la programmation et les bases de données."
    }
  ],
  skills: {
    technical: [
      "TypeScript", "JavaScript", "React", "Vue.js", "Node.js", "Express",
      "MongoDB", "PostgreSQL", "Docker", "Kubernetes", "AWS", "Git",
      "Jest", "Cypress", "Webpack", "Vite", "HTML5", "CSS3", "Sass"
    ],
    languages: [
      "Français (natif)", "Anglais (courant)", "Espagnol (intermédiaire)"
    ],
    soft: [
      "Leadership", "Travail en équipe", "Communication", "Résolution de problèmes",
      "Gestion de projet", "Mentorat", "Pensée critique", "Adaptabilité"
    ]
  },
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "2023-06"
    },
    {
      id: "cert-2",
      name: "React Developer Certification",
      issuer: "Meta",
      date: "2022-11"
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "TaskMaster Pro",
      description: "Application de gestion de tâches collaborative avec temps réel, notifications push et tableau de bord analytique.",
      technologies: ["React", "TypeScript", "Node.js", "Socket.io", "MongoDB"],
      url: "https://taskmaster-pro.com",
      date: "2023"
    },
    {
      id: "proj-2",
      name: "E-Commerce Platform",
      description: "Plateforme e-commerce complète avec gestion des stocks, paiements sécurisés et interface d'administration.",
      technologies: ["Vue.js", "Nuxt.js", "Stripe API", "PostgreSQL"],
      date: "2022"
    }
  ]
}

export type CVData = typeof mockCVData