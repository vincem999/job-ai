// Mock letter data for testing the LetterTemplate component

export const mockLetterData = {
  senderInfo: {
    name: "Jean Dupont",
    address: "123 rue de la République, 75011 Paris",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78"
  },
  recipientInfo: {
    name: "Madame Sophie Martin",
    company: "TechCorp Innovation",
    address: "45 avenue des Champs-Élysées, 75008 Paris"
  },
  date: new Date(),
  subject: "Candidature pour le poste de Développeur Full Stack Senior",
  salutation: "Madame Martin",
  content: {
    opening: "Actuellement en recherche d'opportunités professionnelles, je me permets de vous adresser ma candidature pour le poste de Développeur Full Stack Senior au sein de votre entreprise TechCorp Innovation.",
    body: [
      "Fort de mes 8 années d'expérience dans le développement d'applications web modernes, j'ai acquis une expertise solide en React, Node.js et TypeScript. Mon parcours m'a notamment permis de diriger une équipe de 5 développeurs sur un projet de refonte complète d'une plateforme e-commerce gérant plus de 100 000 utilisateurs quotidiens.",
      "Mes compétences techniques incluent la conception d'architectures microservices, l'optimisation des performances, ainsi que la mise en place de pipelines CI/CD avec Docker et Kubernetes. J'ai pu réduire les temps de déploiement de 75% et améliorer les performances API de 40% sur mes projets précédents.",
      "Votre entreprise, reconnue pour son innovation dans le domaine technologique et sa culture d'entreprise dynamique, correspond parfaitement à mes aspirations professionnelles. Je serais ravi de contribuer au développement de vos solutions et d'apporter mon expertise au sein de votre équipe."
    ],
    closing: "Je reste à votre disposition pour un entretien qui me permettrait de vous présenter plus en détail mon profil et ma motivation. Dans l'attente de votre retour, je vous prie d'agréer, Madame Martin, l'expression de mes salutations distinguées."
  },
  closing: {
    phrase: "Cordialement"
  },
  attachments: [
    "Curriculum Vitae",
    "Portfolio des projets récents",
    "Références professionnelles"
  ]
}

export type LetterData = typeof mockLetterData