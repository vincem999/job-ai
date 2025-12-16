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
 * Generate a structured prompt for job offer analysis using GPT-5
 *
 * This function creates a comprehensive prompt for analyzing job descriptions
 * and extracting key requirements, skills, and responsibilities.
 *
 * @param request - Job analysis request data
 * @param config - Optional configuration for prompt generation
 * @returns Structured prompt string ready for GPT-5
 *
 * @example
 * ```typescript
 * const prompt = generateJobAnalysisPrompt({
 *   jobOffer: "Software Engineer position at TechCorp...",
 *   company: "TechCorp",
 *   position: "Software Engineer"
 * })
 * ```
 */
export function generateJobAnalysisPrompt(
  request: JobAnalysisRequest,
  config: PromptConfig = {}
): string {
  const { jobOffer, company, position, additionalContext } = request
  const { context } = config

  const basePrompt = `Vous êtes un analyste RH expert et consultant en carrière. Votre tâche est d'analyser une offre d'emploi et d'extraire des informations complètes sur les exigences du poste.

**INSTRUCTIONS IMPORTANTES :**
- Fournissez une analyse complète uniquement au format JSON valide
- Soyez précis et spécifique dans votre catégorisation
- Incluez les exigences explicitement mentionnées et implicites
- Concentrez-vous sur des insights actionnables pour l'optimisation de CV
- **RÉPONDEZ EN FRANÇAIS dans tous les champs de texte**

**JOB OFFER TO ANALYZE:**
${jobOffer}

${company ? `**COMPANY:** ${company}` : ""}
${position ? `**POSITION:** ${position}` : ""}
${additionalContext ? `**ADDITIONAL CONTEXT:** ${additionalContext}` : ""}
${context ? `**EXTRA CONTEXT:** ${context}` : ""}

**REQUIRED OUTPUT FORMAT (JSON only):**
{
  "requiredSkills": ["skill1", "skill2"],
  "preferredSkills": ["skill1", "skill2"],
  "responsibilities": ["responsibility1", "responsibility2"],
  "requirements": ["requirement1", "requirement2"],
  "benefits": ["benefit1", "benefit2"],
  "salaryRange": "X - Y per year/month",
  "workLocation": "location or remote/hybrid",
  "workType": "Remote|Hybrid|On-site",
  "experienceLevel": "Entry|Junior|Mid|Senior|Lead|Executive",
  "industryKeywords": ["keyword1", "keyword2"],
  "matchingScore": null,
  "suggestions": ["suggestion1", "suggestion2"]
}

**DIRECTIVES D'ANALYSE :**
1. **Required Skills:** Compétences techniques et relationnelles explicitement mentionnées comme obligatoires
2. **Preferred Skills:** Compétences qui seraient avantageuses mais pas essentielles
3. **Responsibilities:** Principales missions et tâches du poste
4. **Requirements:** Formation, expérience, certifications et autres qualifications
5. **Benefits:** Package de rémunération, avantages et bénéfices entreprise
6. **Salary Range:** Extraire les chiffres exacts si mentionnés, format cohérent
7. **Work Location:** Lieu spécifique ou arrangements de travail à distance
8. **Work Type:** Classer comme Remote, Hybrid ou On-site selon la description
9. **Experience Level:** Déterminer le niveau selon années d'expérience et responsabilités
10. **Industry Keywords:** Termes importants spécifiques à l'industrie/domaine
11. **Suggestions:** Conseils actionnables pour les candidats postulant à ce poste

Retournez UNIQUEMENT l'objet JSON sans texte additionnel ou formatage.`

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
  const { maxLength = 2000, context } = config

  const basePrompt = `Vous êtes un rédacteur de CV expert et consultant en carrière. Votre tâche est d'adapter un CV existant pour mieux correspondre à une opportunité d'emploi spécifique tout en maintenant la véracité et l'authenticité.

**INSTRUCTIONS IMPORTANTES :**
- Maintenez toutes les informations factuelles - ne jamais inventer d'expérience ou de compétences
- Réorganisez et mettez l'accent sur les expériences pertinentes pour le poste ciblé
- Utilisez naturellement des mots-clés appropriés à l'industrie
- Optimisez l'ordre des sections et le focus du contenu
- Fournissez des recommandations spécifiques et actionnables
- Gardez le CV adapté concis mais complet
- Longueur maximale recommandée : ${maxLength} caractères par section
- **RÉPONDEZ EN FRANÇAIS dans tous les champs de texte**

**CURRENT CV DATA:**
${JSON.stringify(cvData, null, 2)}

**TARGET JOB ANALYSIS:**
${JSON.stringify(jobAnalysis, null, 2)}

${focusAreas.length > 0 ? `**FOCUS AREAS:** ${focusAreas.join(", ")}` : ""}
${context ? `**ADDITIONAL CONTEXT:** ${context}` : ""}

**STRATÉGIE D'ADAPTATION :**

1. **Optimisation du Résumé Personnel :**
   - Réécrire le résumé pour s'aligner avec les exigences du poste
   - Mettre en avant les réalisations et compétences pertinentes
   - Utiliser naturellement les mots-clés de l'analyse du poste

2. **Amélioration de la Section Expérience :**
   - Réorganiser les expériences professionnelles par pertinence au poste ciblé
   - Mettre l'accent sur les réalisations qui correspondent aux responsabilités du poste
   - Quantifier l'impact quand possible (pourcentages, chiffres, résultats)
   - Ajouter les technologies/compétences pertinentes utilisées dans chaque poste

3. **Optimisation de la Section Compétences :**
   - Prioriser les compétences requises et préférées de l'analyse du poste
   - Grouper les compétences par catégorie (techniques, relationnelles, outils)
   - Adapter les descriptions de niveau de compétence aux exigences du poste

4. **Formation et Certifications :**
   - Mettre en avant la formation et certifications pertinentes
   - Souligner les cours ou projets liés aux exigences du poste

5. **Amélioration de la Section Projets :**
   - Présenter les projets qui démontrent les compétences pertinentes
   - Connecter les résultats des projets aux responsabilités du poste

**REQUIRED OUTPUT FORMAT (JSON):**
{
  "adaptedPersonalInfo": {
    "summary": "Enhanced summary text focusing on job-relevant aspects"
  },
  "prioritizedWorkExperience": [
    {
      "id": "experience_id",
      "enhancedDescription": "Optimized description with job-relevant keywords",
      "highlightedAchievements": ["achievement1", "achievement2"],
      "relevantSkills": ["skill1", "skill2"],
      "matchingScore": 85
    }
  ],
  "optimizedSkills": [
    {
      "id": "skill_id",
      "priority": "high|medium|low",
      "justification": "Why this skill is important for the role"
    }
  ],
  "recommendedSections": {
    "order": ["personalInfo", "summary", "WorkExperiences", "skills", "projects", "education", "certifications"],
    "emphasis": {
      "WorkExperiences": "high",
      "skills": "high",
      "projects": "medium"
    }
  },
  "keywordOptimization": {
    "addedKeywords": ["keyword1", "keyword2"],
    "naturalPlacements": [
      {
        "keyword": "keyword1",
        "section": "WorkExperiences",
        "context": "How to naturally include this keyword"
      }
    ]
  },
  "improvementSuggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2"
  ],
  "overallMatchScore": 78,
  "strengthsHighlighted": ["strength1", "strength2"],
  "gapsToAddress": ["gap1", "gap2"]
}

Retournez UNIQUEMENT l'objet JSON sans texte additionnel ou formatage.`

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
    WorkExperiences: cvData.WorkExperiences.slice(0, 3), // Most recent 3 experiences
    skills: cvData.skills.slice(0, 10), // Top 10 skills
    education: cvData.education.slice(0, 2), // Most recent education
    projects: cvData.projects.slice(0, 3), // Top 3 projects
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
