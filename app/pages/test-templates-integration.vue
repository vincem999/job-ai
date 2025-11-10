<template>
  <div class="container mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold mb-6">Test Templates with Real API Data</h1>

    <!-- CV Data Test Section -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">CV Data from API</h2>
      </template>

      <div class="space-y-4">
        <div class="flex gap-4">
          <UButton
            color="primary"
            :loading="loadingCV"
            :disabled="loadingCV"
            @click="fetchCVData"
          >
            {{ loadingCV ? 'Loading CV...' : 'Fetch CV Data from API' }}
          </UButton>

          <UButton
            color="secondary"
            :loading="loadingAdaptedCV"
            :disabled="loadingAdaptedCV || !cvData"
            @click="generateAdaptedCV"
          >
            {{ loadingAdaptedCV ? 'Generating...' : 'Generate Adapted CV' }}
          </UButton>
        </div>

        <div v-if="cvError" class="text-red-600">
          <UAlert color="red" title="Error fetching CV data">
            {{ cvError }}
          </UAlert>
        </div>

        <div v-if="cvData" class="border p-4 rounded bg-gray-50">
          <h3 class="font-semibold mb-2">CV Data Status:</h3>
          <p>Name: {{ getPersonName(cvData) }}</p>
          <p>Experiences: {{ cvData.workExperience?.length || 0 }}</p>
          <p>Skills: {{ cvData.skills?.length || 0 }}</p>
          <p>Education: {{ cvData.education?.length || 0 }}</p>
        </div>
      </div>
    </UCard>

    <!-- Letter Generation Test Section -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Cover Letter Generation</h2>
      </template>

      <div class="space-y-4">
        <UButton
          color="primary"
          :loading="loadingLetter"
          :disabled="loadingLetter || !cvData || !jobAnalysis"
          @click="generateCoverLetter"
        >
          {{ loadingLetter ? 'Generating...' : 'Generate Cover Letter' }}
        </UButton>

        <div v-if="letterError" class="text-red-600">
          <UAlert color="red" title="Error generating cover letter">
            {{ letterError }}
          </UAlert>
        </div>

        <div v-if="letterData" class="border p-4 rounded bg-gray-50">
          <h3 class="font-semibold mb-2">Letter Data Status:</h3>
          <p>Word Count: {{ letterData.coverLetter?.wordCount || 0 }}</p>
          <p>Key Highlights: {{ letterData.coverLetter?.keyHighlights?.length || 0 }}</p>
          <p>Suggestions: {{ letterData.suggestions?.length || 0 }}</p>
        </div>
      </div>
    </UCard>

    <!-- Template Rendering Section -->
    <UCard v-if="transformedCVData">
      <template #header>
        <h2 class="text-xl font-semibold">CV Template with Real Data</h2>
      </template>

      <div class="border p-6 bg-white">
        <CVTemplate :cv-data="transformedCVData" />
      </div>
    </UCard>

    <!-- Letter Template Rendering Section -->
    <UCard v-if="transformedLetterData">
      <template #header>
        <h2 class="text-xl font-semibold">Letter Template with Real Data</h2>
      </template>

      <div class="border p-6 bg-white">
        <LetterTemplate :letter-data="transformedLetterData" />
      </div>
    </UCard>

    <!-- Raw Data Debug Section -->
    <UCard v-if="cvData">
      <template #header>
        <h2 class="text-xl font-semibold">Raw API Data (Debug)</h2>
      </template>

      <details class="cursor-pointer">
        <summary class="font-semibold mb-2">Click to view raw CV data</summary>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">{{ JSON.stringify(cvData, null, 2) }}</pre>
      </details>

      <details v-if="adaptedCVData" class="cursor-pointer mt-4">
        <summary class="font-semibold mb-2">Click to view adapted CV data</summary>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">{{ JSON.stringify(adaptedCVData, null, 2) }}</pre>
      </details>

      <details v-if="letterData" class="cursor-pointer mt-4">
        <summary class="font-semibold mb-2">Click to view letter data</summary>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">{{ JSON.stringify(letterData, null, 2) }}</pre>
      </details>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import CVTemplate from '~/components/templates/CVTemplate.vue'
import LetterTemplate from '~/components/templates/LetterTemplate.vue'
import type { CVData as APICVData } from '~/server/utils/validation/schemas'
import type { CVData as TemplateCVData } from '~/components/templates/mockCVData'

// State for CV data
const cvData = ref<APICVData | null>(null)
const loadingCV = ref(false)
const cvError = ref('')

// State for adapted CV data
const adaptedCVData = ref<any>(null)
const loadingAdaptedCV = ref(false)

// State for letter data
const letterData = ref<any>(null)
const loadingLetter = ref(false)
const letterError = ref('')

// Mock job analysis for testing (normally would come from job analysis API)
const jobAnalysis = {
  requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
  preferredSkills: ['Vue.js', 'Docker', 'AWS'],
  responsibilities: ['Develop web applications', 'Collaborate with team'],
  requirements: ['5+ years experience', "Bachelor's degree"],
  experienceLevel: 'Senior' as const,
  industryKeywords: ['web development', 'frontend', 'backend'],
  suggestions: ['Focus on React experience', 'Highlight team leadership']
}

// Fetch CV data from API
const fetchCVData = async () => {
  loadingCV.value = true
  cvError.value = ''

  try {
    const response = await $fetch('/api/cv')

    if (response.success && response.data) {
      cvData.value = response.data
      console.log('✅ CV Data fetched successfully:', response.data)
    } else {
      throw new Error(response.error || 'Failed to fetch CV data')
    }
  } catch (error) {
    console.error('❌ Failed to fetch CV data:', error)
    cvError.value = error instanceof Error ? error.message : 'Unknown error'
  } finally {
    loadingCV.value = false
  }
}

// Generate adapted CV
const generateAdaptedCV = async () => {
  if (!cvData.value) return

  loadingAdaptedCV.value = true

  try {
    const response = await $fetch('/api/adapt-cv', {
      method: 'POST',
      body: {
        cvData: cvData.value,
        jobAnalysis: jobAnalysis,
        focusAreas: ['technical skills', 'leadership experience']
      }
    })

    if (response.success && response.data) {
      adaptedCVData.value = response.data
      console.log('✅ CV adapted successfully:', response.data)
    } else {
      throw new Error('Failed to adapt CV')
    }
  } catch (error) {
    console.error('❌ Failed to adapt CV:', error)
    cvError.value = error instanceof Error ? error.message : 'Unknown error adapting CV'
  } finally {
    loadingAdaptedCV.value = false
  }
}

// Generate cover letter
const generateCoverLetter = async () => {
  if (!cvData.value) return

  loadingLetter.value = true
  letterError.value = ''

  try {
    const response = await $fetch('/api/generate-letter', {
      method: 'POST',
      body: {
        cvData: cvData.value,
        jobAnalysis: jobAnalysis,
        personalMessage: 'I am very interested in this position',
        tone: 'Professional'
      }
    })

    if (response.success && response.data) {
      letterData.value = response.data
      console.log('✅ Letter generated successfully:', response.data)
    } else {
      throw new Error('Failed to generate letter')
    }
  } catch (error) {
    console.error('❌ Failed to generate letter:', error)
    letterError.value = error instanceof Error ? error.message : 'Unknown error generating letter'
  } finally {
    loadingLetter.value = false
  }
}

// Helper function to get person name from API data
const getPersonName = (data: APICVData): string => {
  if (!data?.personalInfo) return 'Unknown'
  return `${data.personalInfo.firstName || ''} ${data.personalInfo.lastName || ''}`.trim()
}

// Transform API CV data to template format
const transformedCVData = computed((): TemplateCVData | null => {
  if (!cvData.value) return null

  const apiData = cvData.value

  return {
    personalInfo: {
      name: `${apiData.personalInfo.firstName} ${apiData.personalInfo.lastName}`,
      title: apiData.personalInfo.summary || 'Professional', // Use summary as title for now
      email: apiData.personalInfo.email,
      phone: apiData.personalInfo.phone || '',
      location: apiData.personalInfo.address ?
        `${apiData.personalInfo.address.city}, ${apiData.personalInfo.address.country}` : '',
      linkedin: apiData.personalInfo.linkedin,
      github: apiData.personalInfo.github
    },
    summary: apiData.personalInfo.summary || '',
    experiences: apiData.workExperience.map((exp) => ({
      id: exp.id,
      title: exp.position,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate ? new Date(exp.startDate).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' }) : '',
      endDate: exp.endDate ? new Date(exp.endDate).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' }) : exp.isCurrentPosition ? 'Présent' : '',
      description: exp.description,
      bullets: exp.achievements || [],
      skills: exp.technologies || []
    })),
    education: apiData.education.map((edu) => ({
      id: edu.id,
      degree: edu.degree,
      institution: edu.institution,
      year: edu.endDate ? new Date(edu.endDate).getFullYear().toString() : new Date(edu.startDate).getFullYear().toString(),
      description: edu.description || ''
    })),
    skills: {
      technical: apiData.skills.filter(s => s.category === 'technical').map(s => s.name),
      languages: apiData.languages?.map(l => `${l.name} (${l.level})`) || [],
      soft: apiData.skills.filter(s => s.category === 'soft').map(s => s.name)
    },
    certifications: apiData.certifications?.map(cert => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      date: cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : undefined
    })),
    projects: apiData.projects?.map(proj => ({
      id: proj.id,
      name: proj.name,
      description: proj.description,
      technologies: proj.technologies,
      url: proj.url,
      date: proj.endDate ? new Date(proj.endDate).getFullYear().toString() : undefined
    }))
  }
})

// Transform letter data to template format
const transformedLetterData = computed(() => {
  if (!letterData.value?.coverLetter || !cvData.value) return null

  const letter = letterData.value.coverLetter
  const personalInfo = cvData.value.personalInfo

  return {
    senderInfo: {
      name: `${personalInfo.firstName} ${personalInfo.lastName}`,
      address: personalInfo.address ?
        `${personalInfo.address.street || ''} ${personalInfo.address.city} ${personalInfo.address.zipCode || ''}`.trim() : '',
      email: personalInfo.email,
      phone: personalInfo.phone || ''
    },
    recipientInfo: {
      name: letter.header.recipientInfo || 'Hiring Manager',
      company: 'Company Name', // Would be filled from job analysis
      address: ''
    },
    date: letter.header.date || new Date().toISOString(),
    subject: `Candidature pour le poste de ${jobAnalysis.requirements[0] || 'Professional'}`,
    salutation: 'Madame, Monsieur',
    content: {
      opening: letter.content.opening,
      body: [letter.content.bodyParagraph1, letter.content.bodyParagraph2],
      closing: letter.content.closing
    },
    closing: {
      phrase: 'Cordialement'
    },
    attachments: ['CV', 'Portfolio']
  }
})

// Auto-fetch CV data on mount
onMounted(() => {
  fetchCVData()
})
</script>