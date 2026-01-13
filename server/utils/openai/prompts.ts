import type {
  JobAnalysisRequest,
  JobAnalysisResponse,
  CVData,
  CoverLetterRequest,
} from "../validation/schemas"

/**
 * Configuration for prompt generation
 */
interface PromptConfig {
  /** Maximum length for generated content */
  maxLength?: number
  /** Tone of the generated content */
  tone?: "Professional" | "Friendly" | "Enthusiastic" | "Formal"
  /** Additional context to include */
  context?: string
}

/**
 * Generate a structured prompt for job offer analysis with optional ATS optimization
 *
 * This function creates a comprehensive prompt for analyzing job descriptions
 * and extracting key requirements, skills, and responsibilities. When CV data is provided,
 * it also includes ATS optimization analysis.
 *
 * @param request - Job analysis request data (now with optional CV)
 * @param config - Optional configuration for prompt generation
 * @returns Structured prompt string ready for GPT-5
 *
 * @example
 * ```typescript
 * const prompt = generateJobAnalysisPrompt({
 *   jobOffer: "Software Engineer position at TechCorp...",
 *   company: "TechCorp",
 *   position: "Software Engineer",
 *   cvData: userCV // Optional for ATS optimization
 * })
 * ```
 */
export function generateJobAnalysisPrompt(
  request: JobAnalysisRequest,
  config: PromptConfig = {}
): string {
  const { jobOffer, company, position, additionalContext, cvData } = request
  const { context } = config

  const hasCV = !!cvData

  const basePrompt = `Vous êtes un analyste RH expert et consultant en carrière. Votre tâche est d'analyser une offre d'emploi et d'extraire des informations complètes sur les exigences du poste${hasCV ? ' ET d\'optimiser le passage ATS d\'un CV candidat' : ''}.

**INSTRUCTIONS IMPORTANTES :**
- Soyez précis et spécifique dans votre catégorisation
- Incluez les exigences explicitement mentionnées et implicites
- Concentrez-vous sur des insights actionnables pour l'optimisation de CV
- **RÉPONDEZ EN FRANÇAIS dans tous les champs de texte**

**OFFRE D'EMPLOI À ANALYSER :**
${jobOffer}

${company ? `**ENTREPRISE :** ${company}` : ""}
${position ? `**POSTE :** ${position}` : ""}
${additionalContext ? `**CONTEXTE SUPPLÉMENTAIRE :** ${additionalContext}` : ""}
${context ? `**CONTEXTE EXTRA :** ${context}` : ""}

${hasCV ? `
**CV DU CANDIDAT (pour optimisation ATS) :**
${JSON.stringify(cvData, null, 2)}
` : ""}

**DIRECTIVES D'ANALYSE :**
1. **Required Skills:** Compétences techniques et relationnelles explicitement mentionnées comme obligatoires
2. **Preferred Skills:** Compétences qui seraient avantageuses mais pas essentielles
3. **Responsibilities:** Principales missions et tâches du poste
4. **Requirements:** Formation, expérience, certifications et autres qualifications
5. **Experience Level:** Déterminer le niveau selon années d'expérience et responsabilités (Entry/Junior/Mid/Senior/Lead/Executive)
6. **Industry Keywords:** Termes importants spécifiques à l'industrie/domaine qui optimiseront le passage des ATS

${hasCV ? `
**OPTIMISATION ATS (si CV fourni) :**
Analysez la compatibilité du CV avec l'offre du point de vue ATS :
- **Score ATS** (0-100) : Capacité du CV à passer les filtres automatiques
- **Mots-clés matched** : Termes du CV qui correspondent exactement à l'offre
- **Mots-clés missing** : Termes critiques de l'offre d'emploi absents du CV
- **Mots-clés recommended** : Suggestions de mots-clés du secteur pour renforcer le profil (pas nécessairement dans l'offre)
- **Suggestions** : Actions concrètes pour optimiser le CV pour les ATS

**Adaptation nécessaire ?** Déterminer si le CV a besoin d'être adapté (score < 80).
` : ""}

Analysez l'offre${hasCV ? ' et le CV' : ''} pour permettre l'adaptation optimale du candidat.`

  return basePrompt
}

/**
 * Generate a structured prompt for CV-to-ATS matching analysis
 *
 * This function creates a prompt for evaluating how well a CV will perform
 * against ATS (Applicant Tracking Systems) for a specific job posting.
 * Focuses on keyword matching, format compatibility, and ATS optimization.
 *
 * @param cvData - Complete CV data to be analyzed
 * @param jobAnalysis - Analysis results from job offer analysis
 * @param config - Optional configuration for prompt generation
 * @returns Structured prompt string ready for GPT-5
 *
 * @example
 * ```typescript
 * const prompt = generateATSMatchingPrompt(cvData, jobAnalysis)
 * ```
 */
export function generateATSMatchingPrompt(
  cvData: CVData,
  jobAnalysis: JobAnalysisResponse,
  config: PromptConfig = {}
): string {
  const { context } = config

  const basePrompt = `Vous êtes un expert en optimisation ATS (Applicant Tracking Systems). Votre tâche est d'évaluer la compatibilité entre un CV et une offre d'emploi du point de vue des systèmes de tri automatique, puis de fournir un score d'optimisation ATS.

**OBJECTIF :**
Analyser uniquement la capacité du CV à passer les filtres automatiques des ATS, pas l'adéquation générale du profil au poste.

**INSTRUCTIONS IMPORTANTES :**
- Focus sur la correspondance des mots-clés avec l'offre d'emploi
- Évaluer la présence des termes techniques et compétences exactes demandées
- Identifier les variations de terminologie qui pourraient être ratées par l'ATS
- **RÉPONDEZ EN FRANÇAIS dans tous les champs**

**CV DU CANDIDAT :**
${JSON.stringify(cvData, null, 2)}

**ANALYSE DE L'OFFRE D'EMPLOI :**
${JSON.stringify(jobAnalysis, null, 2)}

${context ? `**CONTEXTE SUPPLÉMENTAIRE :** ${context}` : ""}

**CRITÈRES D'ÉVALUATION ATS :**

1. **Mots-clés obligatoires (50% du score) :**
   - Présence exacte des compétences techniques requises
   - Correspondance des intitulés de postes et responsabilités
   - Terminologie spécifique à l'industrie

2. **Mots-clés préférentiels (30% du score) :**
   - Présence des compétences souhaitées mais non obligatoires
   - Technologies et outils mentionnés comme "un plus"

3. **Optimisation textuelle (20% du score) :**
   - Variations et synonymes des termes clés
   - Densité appropriée des mots-clés (ni trop, ni trop peu)
   - Placement stratégique dans les sections importantes

**RÈGLES DE SCORING ATS :**
- Score ≥ 85: Excellent passage ATS garanti
- Score 70-84: Bon passage ATS, optimisation légère recommandée
- Score 55-69: Passage ATS moyen, optimisation importante nécessaire
- Score 40-54: Risque de filtrage ATS, adaptation majeure requise
- Score < 40: Forte probabilité d'être filtré par l'ATS

Analysez la correspondance ATS et fournissez un scoring détaillé avec des recommandations d'optimisation spécifiques.`

  return basePrompt
}

/**
 * Generate a structured prompt for CV adaptation based on job analysis
 *
 * This function creates a prompt for adapting CVs to specific job requirements,
 * focusing on highlighting relevant experience and skills.
 *
 * @param cvData - Complete CV data to be adapted
 * @param jobAnalysis - Analysis results from job offer analysis
 * @param focusAreas - Optional specific areas to emphasize
 * @param config - Optional configuration for prompt generation
 * @returns Structured prompt string ready for GPT-5
 *
 * @example
 * ```typescript
 * const prompt = generateCVAdaptationPrompt(
 *   cvData,
 *   jobAnalysis,
 *   ['technical skills', 'leadership experience']
 * )
 * ```
 */
export function generateCVAdaptationPrompt(
  cvData: CVData,
  jobAnalysis: JobAnalysisResponse,
  focusAreas: string[] = [],
  config: PromptConfig = {}
): string {
  const { context } = config
  const relevantJobData = {
    requiredSkills: jobAnalysis.requiredSkills,
    industryKeywords: jobAnalysis.industryKeywords,
    preferredSkills: jobAnalysis.preferredSkills,
  }

  const basePrompt = `Vous êtes un expert en optimisation de CV. Votre tâche est d'enrichir les descriptions ET les bullets des expériences professionnelles en intégrant naturellement les mots-clés pertinents du poste
  ciblé.

**INSTRUCTIONS IMPORTANTES :**
- Modifiez les descriptions ET les bullets des expériences professionnelles
- Intégrez naturellement les mots-clés de l'analyse de poste dans les descriptions et bullets
- **PRIORITÉ À LA COHÉRENCE** : N'ajoutez un mot-clé que s'il s'intègre naturellement
- **NE FORCEZ JAMAIS** l'intégration si cela altère le sens ou la crédibilité
- Maintenez la véracité - ne jamais inventer d'expériences ou compétences
- Préservez le sens et la structure originale des descriptions et bullets
- Mieux vaut une description/bullet authentique qu'une version artificielle avec des mots-clés forcés

**EXPÉRIENCES PROFESSIONNELLES ACTUELLES :**
${JSON.stringify(cvData.workExperiences, null, 2)}

**MOTS-CLÉS À INTÉGRER :**
${JSON.stringify(relevantJobData, null, 2)}

${
  focusAreas.length > 0
    ? `**DOMAINES À PRIORISER :** ${focusAreas.join(", ")}`
    : ""
}
${context ? `**CONTEXTE SUPPLÉMENTAIRE :** ${context}` : ""}

**STRATÉGIE D'ENRICHISSEMENT :**

**PRINCIPE FONDAMENTAL :**
L'authenticité prime sur l'optimisation. Si un mot-clé ne peut pas être intégré naturellement dans une expérience ou un bullet, ne le forcez pas. Une description/bullet cohérent et crédible vaut mieux qu'une version
bourrée de mots-clés qui sonne artificielle.

1. **Évaluation de pertinence AVANT intégration :**
    - Le mot-clé correspond-il réellement aux tâches effectuées ?
    - Peut-il être intégré sans altérer le sens original ?
    - La description/bullet reste-t-il fluide et naturel après ajout ?

2. **Intégration des mots-clés obligatoires (requiredSkills) :**
    - Identifiez les expériences et bullets où ces compétences ont été RÉELLEMENT utilisées
    - Si aucune correspondance naturelle : laissez la description/bullet original

3. **Optimisation des bullets :**
    - Les bullets sont souvent plus spécifiques que les descriptions générales
    - Ils sont idéaux pour intégrer des technologies, méthodologies et compétences techniques
    - Modifiez les bullets existants pour inclure des mots-clés pertinents
    - Conservez la structure de liste à puces et le style concis`

  return basePrompt
}

/**
 * Generate a structured prompt for cover letter creation
 *
 * This function creates a prompt for generating personalized cover letters
 * that highlight the candidate's fit for a specific role.
 *
 * @param request - Cover letter generation request data
 * @param config - Optional configuration for prompt generation
 * @returns Structured prompt string ready for GPT-5
 *
 * @example
 * ```typescript
 * const prompt = generateCoverLetterPrompt({
 *   cvData,
 *   jobAnalysis,
 *   personalMessage: "I'm excited about this opportunity...",
 *   tone: 'Enthusiastic'
 * })
 * ```
 */
export function generateCoverLetterPrompt(
  request: CoverLetterRequest,
  config: PromptConfig = {}
): string {
  const { cvData, jobAnalysis, personalMessage, tone } = request
  const { maxLength = 800, context } = config

  const toneInstructions = {
    Professional:
      "Utilisez un langage d'affaires formel, concentrez-vous sur les qualifications et réalisations",
    Friendly:
      "Utilisez un langage chaleureux et accessible tout en maintenant le professionnalisme",
    Enthusiastic:
      "Montrez un véritable enthousiasme et une passion pour le rôle et l'entreprise",
    Formal:
      "Utilisez un langage traditionnel et conservateur approprié aux organisations formelles",
  }

  const basePrompt = `Vous êtes un conseiller en carrière expert et rédacteur professionnel. Votre tâche est de créer une lettre de motivation convaincante et personnalisée qui connecte efficacement le parcours du candidat à l'opportunité d'emploi ciblée.

**INSTRUCTIONS IMPORTANTES :**
- Rédigez dans un ton ${tone.toLowerCase()} : ${toneInstructions[tone]}
- Longueur maximale : ${maxLength} mots
- Suivez la structure standard d'une lettre d'affaires
- Soyez spécifique et évitez les déclarations génériques
- Connectez l'expérience du candidat aux exigences du poste
- Montrez une compréhension de l'entreprise et du rôle
- Incluez une ouverture forte et une conclusion convaincante
- Maintenez l'authenticité - ne jamais inventer d'expériences
- **RÉDIGEZ EN FRANÇAIS**

**CANDIDATE CV DATA:**
${JSON.stringify(
  {
    personalInfo: cvData.personalInfo,
    workExperiences: cvData.workExperiences.slice(0, 3), // Most recent 3 experiences
    skills: {
      technical: cvData.skills.technical.slice(0, 10),
      languages: cvData.skills.languages.slice(0, 5),
      soft: cvData.skills.soft.slice(0, 5)
    }, // Top skills
    education: cvData.education.slice(0, 2), // Most recent education
    projects: cvData.projects?.slice(0, 3) || [], // Top 3 projects
  },
  null,
  2
)}

**TARGET JOB ANALYSIS:**
${JSON.stringify(jobAnalysis, null, 2)}

${
  personalMessage
    ? `**PERSONAL MESSAGE FROM CANDIDATE:** ${personalMessage}`
    : ""
}
${context ? `**ADDITIONAL CONTEXT:** ${context}` : ""}

**STRUCTURE DE LA LETTRE DE MOTIVATION :**

1. **Paragraphe d'ouverture (2-3 phrases) :**
   - Exprimer l'intérêt pour le poste spécifique
   - Mentionner brièvement la qualification ou réalisation la plus pertinente
   - Montrer la connaissance de l'entreprise/du rôle

2. **Paragraphe principal 1 (3-4 phrases) :**
   - Mettre en avant l'expérience professionnelle la plus pertinente
   - Connecter des réalisations spécifiques aux exigences du poste
   - Utiliser des résultats quantifiables quand possible

3. **Paragraphe principal 2 (3-4 phrases) :**
   - Souligner les compétences clés qui correspondent aux exigences du poste
   - Mentionner des projets pertinents ou qualifications additionnelles
   - Montrer la compréhension des défis du rôle et comment vous pouvez les adresser

4. **Paragraphe de conclusion (2-3 phrases) :**
   - Réitérer l'intérêt et l'adéquation pour le rôle
   - Suggérer les prochaines étapes (entretien, révision de portfolio, etc.)
   - Déclaration de clôture professionnelle

**REQUIRED OUTPUT FORMAT (JSON):**
{
  "coverLetter": {
    "header": {
      "candidateName": "${cvData.personalInfo.firstName} ${
    cvData.personalInfo.lastName
  }",
      "candidateEmail": "${cvData.personalInfo.email}",
      "date": "Current date",
      "recipientInfo": "Hiring Manager or specific contact if known"
    },
    "content": {
      "opening": "Opening paragraph text",
      "bodyParagraph1": "First body paragraph text",
      "bodyParagraph2": "Second body paragraph text",
      "closing": "Closing paragraph text"
    },
    "fullText": "Complete cover letter as a single formatted string",
    "wordCount": 350,
    "keyHighlights": [
      "Key point 1 emphasized in the letter",
      "Key point 2 emphasized in the letter"
    ]
  },
  "matchingElements": {
    "addressedRequirements": ["requirement1", "requirement2"],
    "highlightedSkills": ["skill1", "skill2"],
    "quantifiedAchievements": ["achievement1", "achievement2"]
  },
  "suggestions": [
    "Optional improvement suggestion 1",
    "Optional improvement suggestion 2"
  ]
}

**DIRECTIVES SPÉCIFIQUES AU TON ${tone.toUpperCase()} :**
${toneInstructions[tone]}

Retournez UNIQUEMENT l'objet JSON sans texte additionnel ou formatage.`

  return basePrompt
}

/**
 * Utility function to validate prompt templates by checking for required elements
 *
 * @param promptType - Type of prompt to validate
 * @param prompt - Generated prompt string
 * @returns Validation result with any issues found
 */
export function validatePromptTemplate(
  promptType: "jobAnalysis" | "cvAdaptation" | "coverLetter",
  prompt: string
): { isValid: boolean; issues: string[] } {
  const issues: string[] = []

  // Common validations
  if (prompt.length < 100) {
    issues.push("Prompt is too short - may not provide sufficient context")
  }

  if (prompt.length > 10000) {
    issues.push("Prompt is too long - may exceed token limits")
  }

  if (!prompt.includes("JSON")) {
    issues.push("Prompt should specify JSON output format")
  }

  // Type-specific validations
  switch (promptType) {
    case "jobAnalysis":
      if (
        !prompt.includes("requiredSkills") ||
        !prompt.includes("preferredSkills")
      ) {
        issues.push(
          "Job analysis prompt missing required skill extraction elements"
        )
      }
      break

    case "cvAdaptation":
      if (
        !prompt.includes("matchingScore") ||
        !prompt.includes("keywordOptimization")
      ) {
        issues.push("CV adaptation prompt missing optimization elements")
      }
      break

    case "coverLetter":
      if (!prompt.includes("tone") || !prompt.includes("wordCount")) {
        issues.push("Cover letter prompt missing formatting requirements")
      }
      break
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}
