import type {
  JobAnalysisRequest,
  JobAnalysisResponse,
  CVData,
  CoverLetterRequest,
} from '../validation/schemas'

/**
 * Configuration for prompt generation
 */
interface PromptConfig {
  /** Maximum length for generated content */
  maxLength?: number
  /** Tone of the generated content */
  tone?: 'Professional' | 'Friendly' | 'Enthusiastic' | 'Formal'
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

  const basePrompt = `You are an expert HR analyst and career consultant. Your task is to analyze a job offer and extract comprehensive information about the role requirements.

**IMPORTANT INSTRUCTIONS:**
- Provide a thorough analysis in valid JSON format only
- Be precise and specific in your categorization
- Include both explicitly mentioned and implied requirements
- Focus on actionable insights for CV optimization

**JOB OFFER TO ANALYZE:**
${jobOffer}

${company ? `**COMPANY:** ${company}` : ''}
${position ? `**POSITION:** ${position}` : ''}
${additionalContext ? `**ADDITIONAL CONTEXT:** ${additionalContext}` : ''}
${context ? `**EXTRA CONTEXT:** ${context}` : ''}

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

**ANALYSIS GUIDELINES:**
1. **Required Skills:** Technical and soft skills explicitly mentioned as mandatory
2. **Preferred Skills:** Skills that would be advantageous but not essential
3. **Responsibilities:** Main duties and tasks of the role
4. **Requirements:** Education, experience, certifications, and other qualifications
5. **Benefits:** Compensation package, perks, and company benefits
6. **Salary Range:** Extract exact figures if mentioned, format consistently
7. **Work Location:** Specific location or remote work arrangements
8. **Work Type:** Classify as Remote, Hybrid, or On-site based on description
9. **Experience Level:** Determine level based on years of experience and responsibilities
10. **Industry Keywords:** Important terms specific to the industry/domain
11. **Suggestions:** Actionable advice for candidates applying to this role

Return ONLY the JSON object without any additional text or formatting.`

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

  const basePrompt = `You are an expert CV writer and career consultant. Your task is to adapt an existing CV to better match a specific job opportunity while maintaining truthfulness and authenticity.

**IMPORTANT INSTRUCTIONS:**
- Maintain all factual information - never fabricate experience or skills
- Reorganize and emphasize relevant experiences for the target role
- Use industry-appropriate keywords naturally
- Optimize section order and content focus
- Provide specific, actionable recommendations
- Keep the adapted CV concise but comprehensive
- Maximum recommended length: ${maxLength} characters per section

**CURRENT CV DATA:**
${JSON.stringify(cvData, null, 2)}

**TARGET JOB ANALYSIS:**
${JSON.stringify(jobAnalysis, null, 2)}

${focusAreas.length > 0 ? `**FOCUS AREAS:** ${focusAreas.join(', ')}` : ''}
${context ? `**ADDITIONAL CONTEXT:** ${context}` : ''}

**ADAPTATION STRATEGY:**

1. **Personal Summary Optimization:**
   - Rewrite the summary to align with the job requirements
   - Highlight relevant achievements and skills
   - Use keywords from the job analysis naturally

2. **Experience Section Enhancement:**
   - Reorder work experiences by relevance to target role
   - Emphasize achievements that match job responsibilities
   - Quantify impact where possible (percentages, numbers, results)
   - Add relevant technologies/skills used in each role

3. **Skills Section Optimization:**
   - Prioritize required and preferred skills from job analysis
   - Group skills by category (technical, soft skills, tools)
   - Match skill level descriptions to job requirements

4. **Education and Certifications:**
   - Highlight relevant education and certifications
   - Emphasize coursework or projects related to job requirements

5. **Projects Section Enhancement:**
   - Feature projects that demonstrate relevant skills
   - Connect project outcomes to job responsibilities

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
    "order": ["personalInfo", "summary", "workExperience", "skills", "projects", "education", "certifications"],
    "emphasis": {
      "workExperience": "high",
      "skills": "high",
      "projects": "medium"
    }
  },
  "keywordOptimization": {
    "addedKeywords": ["keyword1", "keyword2"],
    "naturalPlacements": [
      {
        "keyword": "keyword1",
        "section": "workExperience",
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

Return ONLY the JSON object without any additional text or formatting.`

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
    Professional: 'Use formal business language, focus on qualifications and achievements',
    Friendly: 'Use warm, approachable language while maintaining professionalism',
    Enthusiastic: 'Show genuine excitement and passion for the role and company',
    Formal: 'Use traditional, conservative language appropriate for formal organizations'
  }

  const basePrompt = `You are an expert career counselor and professional writer. Your task is to create a compelling, personalized cover letter that effectively connects the candidate's background to the target job opportunity.

**IMPORTANT INSTRUCTIONS:**
- Write in ${tone.toLowerCase()} tone: ${toneInstructions[tone]}
- Maximum length: ${maxLength} words
- Follow standard business letter structure
- Be specific and avoid generic statements
- Connect candidate's experience to job requirements
- Show understanding of the company and role
- Include a strong opening and compelling closing
- Maintain authenticity - never fabricate experiences

**CANDIDATE CV DATA:**
${JSON.stringify({
  personalInfo: cvData.personalInfo,
  workExperience: cvData.workExperience.slice(0, 3), // Most recent 3 experiences
  skills: cvData.skills.slice(0, 10), // Top 10 skills
  education: cvData.education.slice(0, 2), // Most recent education
  projects: cvData.projects.slice(0, 3) // Top 3 projects
}, null, 2)}

**TARGET JOB ANALYSIS:**
${JSON.stringify(jobAnalysis, null, 2)}

${personalMessage ? `**PERSONAL MESSAGE FROM CANDIDATE:** ${personalMessage}` : ''}
${context ? `**ADDITIONAL CONTEXT:** ${context}` : ''}

**COVER LETTER STRUCTURE:**

1. **Opening Paragraph (2-3 sentences):**
   - Express interest in the specific position
   - Briefly mention most relevant qualification or achievement
   - Show knowledge of the company/role

2. **Body Paragraph 1 (3-4 sentences):**
   - Highlight most relevant work experience
   - Connect specific achievements to job requirements
   - Use quantifiable results when possible

3. **Body Paragraph 2 (3-4 sentences):**
   - Emphasize key skills that match job requirements
   - Mention relevant projects or additional qualifications
   - Show understanding of role challenges and how you can address them

4. **Closing Paragraph (2-3 sentences):**
   - Reiterate interest and fit for the role
   - Suggest next steps (interview, portfolio review, etc.)
   - Professional closing statement

**REQUIRED OUTPUT FORMAT (JSON):**
{
  "coverLetter": {
    "header": {
      "candidateName": "${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}",
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

**TONE-SPECIFIC GUIDELINES FOR ${tone.toUpperCase()}:**
${toneInstructions[tone]}

Return ONLY the JSON object without any additional text or formatting.`

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
  promptType: 'jobAnalysis' | 'cvAdaptation' | 'coverLetter',
  prompt: string
): { isValid: boolean; issues: string[] } {
  const issues: string[] = []

  // Common validations
  if (prompt.length < 100) {
    issues.push('Prompt is too short - may not provide sufficient context')
  }

  if (prompt.length > 10000) {
    issues.push('Prompt is too long - may exceed token limits')
  }

  if (!prompt.includes('JSON')) {
    issues.push('Prompt should specify JSON output format')
  }

  // Type-specific validations
  switch (promptType) {
    case 'jobAnalysis':
      if (!prompt.includes('requiredSkills') || !prompt.includes('preferredSkills')) {
        issues.push('Job analysis prompt missing required skill extraction elements')
      }
      break

    case 'cvAdaptation':
      if (!prompt.includes('matchingScore') || !prompt.includes('keywordOptimization')) {
        issues.push('CV adaptation prompt missing optimization elements')
      }
      break

    case 'coverLetter':
      if (!prompt.includes('tone') || !prompt.includes('wordCount')) {
        issues.push('Cover letter prompt missing formatting requirements')
      }
      break
  }

  return {
    isValid: issues.length === 0,
    issues
  }
}